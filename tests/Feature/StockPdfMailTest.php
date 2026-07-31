<?php

use App\Mail\ReceptionMail;
use App\Mail\StockMovementMail;
use App\Models\Agency;
use App\Models\Product;
use App\Models\Role;
use App\Models\StockOperation;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    File::deleteDirectory(storage_path('app/documents'));
    Storage::fake('public');

    $this->agency = Agency::create(['name' => 'Casablanca', 'city' => 'Casablanca']);
    $this->otherAgency = Agency::create(['name' => 'Marrakech', 'city' => 'Marrakech']);

    $this->stockRole = Role::create(['name' => 'Responsable Stock', 'slug' => 'responsable-stock']);
    Role::create(['name' => 'Responsable Commercial', 'slug' => 'responsable-commercial']);
    Role::create(['name' => 'Gestion Administrative', 'slug' => 'gestion-administrative']);
    Role::create(['name' => 'Administrateur Local', 'slug' => 'admin-local']);

    $this->stockUser = User::factory()->create([
        'name' => 'Alice Stock', 'email' => 'alice.stock@test.dev',
        'agency_id' => $this->agency->id, 'role_id' => $this->stockRole->id,
    ]);

    $this->commercial = User::factory()->create([
        'name' => 'Benoit Com', 'email' => 'benoit.com@test.dev',
        'agency_id' => $this->agency->id,
        'role_id' => Role::where('slug', 'responsable-commercial')->first()->id,
    ]);
    $this->adminLocal = User::factory()->create([
        'name' => 'Claire Admin', 'email' => 'claire.admin@test.dev',
        'agency_id' => $this->agency->id,
        'role_id' => Role::where('slug', 'admin-local')->first()->id,
    ]);
    $this->gestion = User::factory()->create([
        'name' => 'David Gest', 'email' => 'david.gest@test.dev',
        'agency_id' => $this->otherAgency->id,
        'role_id' => Role::where('slug', 'gestion-administrative')->first()->id,
    ]);
    $this->foreignCommercial = User::factory()->create([
        'name' => 'Emma Autre', 'email' => 'emma.autre@test.dev',
        'agency_id' => $this->otherAgency->id,
        'role_id' => Role::where('slug', 'responsable-commercial')->first()->id,
    ]);

    $this->product = Product::create([
        'name' => 'Dell Latitude 5540', 'reference' => 'PRD-CASA-001', 'category' => 'Informatique',
        'unit_price' => 1000, 'quantity_in_stock' => 5, 'reserved_quantity' => 0,
        'minimum_stock' => 2, 'agency_id' => $this->agency->id, 'status' => 'active',
    ]);
});

it('attaches only the uploaded document to the movement email', function () {
    Mail::fake();

    $this->actingAs($this->stockUser)->post('/dashboard-stock/mouvement', [
        'type' => 'Entrée',
        'quantity' => 3,
        'product' => 'Dell Latitude 5540',
        'agency' => 'Casablanca',
        'document_type' => 'Bon de livraison',
        'document_file' => UploadedFile::fake()->create('BL-2026-001.pdf', 100, 'application/pdf'),
    ])->assertRedirect()->assertSessionHas('success');

    $operation = StockOperation::where('section', 'mouvements')->firstOrFail();

    expect($operation->quantity)->toBe(3);
    expect($operation->metadata['type'])->toBe('Entrée');
    expect($operation->document_type)->toBe('Bon de livraison');
    expect($operation->original_file_name)->toBe('BL-2026-001.pdf');
    expect(Storage::disk('public')->exists($operation->document_path))->toBeTrue();
    expect($this->product->fresh()->quantity_in_stock)->toBe(8);

    Mail::assertSent(StockMovementMail::class, 3);

    $mailRecipients = collect(Mail::sent(StockMovementMail::class))
        ->flatMap(fn ($mail) => $mail->to)
        ->map(fn ($to) => $to["address"] ?? $to->address)
        ->unique()
        ->values();

    expect($mailRecipients)->toContain($this->commercial->email)
        ->toContain($this->adminLocal->email)
        ->toContain($this->gestion->email)
        ->not->toContain($this->foreignCommercial->email);

    foreach (Mail::sent(StockMovementMail::class) as $mail) {
        expect(count($mail->attachments()))->toBe(1);
        expect($mail->attachments()[0]->as)->toBe('BL-2026-001.pdf');
    }

    Mail::assertSent(StockMovementMail::class, fn (StockMovementMail $mail) => str_contains($mail->render(), 'en pièce jointe'));
    Mail::assertSent(StockMovementMail::class, fn (StockMovementMail $mail) => str_contains($mail->render(), 'Type de document') && str_contains($mail->render(), 'Bon de livraison'));

    $this->actingAs($this->stockUser)->post('/dashboard-stock/mouvement', [
        'type' => 'Sortie',
        'quantity' => 2,
        'product' => 'Dell Latitude 5540',
        'agency' => 'Casablanca',
        'document_type' => 'Bon de livraison',
        'document_file' => UploadedFile::fake()->create('BS-2026-002.pdf', 100, 'application/pdf'),
    ])->assertRedirect()->assertSessionHas('success');

    StockOperation::where('section', 'mouvements')->latest()->firstOrFail();
    expect($this->product->fresh()->quantity_in_stock)->toBe(6);
});

it('rejects a sortie exceeding the available stock and generates no PDF', function () {
    Mail::fake();

    $this->actingAs($this->stockUser)->post('/dashboard-stock/mouvement', [
        'type' => 'Sortie',
        'quantity' => 99,
        'product' => 'Dell Latitude 5540',
        'agency' => 'Casablanca',
        'document_type' => 'Bon de livraison',
        'document_file' => UploadedFile::fake()->create('BL.pdf', 100, 'application/pdf'),
    ])->assertSessionHasErrors('quantity');

    expect(StockOperation::where('section', 'mouvements')->count())->toBe(0);
    expect(File::isDirectory(storage_path('app/documents/delivery-notes')))->toBeFalse();
    Mail::assertNothingSent();
});

it('emails the reception validation without any generated PDF', function () {
    Mail::fake();

    $reception = StockOperation::create([
        'reference' => 'REC-2026-0001', 'section' => 'receptions', 'name' => 'Fournisseur Atlas',
        'detail' => '10 unités de papier A4', 'agency_id' => $this->agency->id,
        'created_by' => $this->stockUser->id, 'quantity' => 10, 'status' => 'À contrôler',
    ]);

    $this->actingAs($this->stockUser)->patch("/dashboard-stock/receptions/{$reception->id}/valider")
        ->assertRedirect()->assertSessionHas('success');

    expect($reception->fresh()->status)->toBe('Validée');
    expect(File::isDirectory(storage_path('app/documents/reception-notes')))->toBeFalse();

    Mail::assertSent(ReceptionMail::class, 3);

    $mailRecipients = collect(Mail::sent(ReceptionMail::class))
        ->flatMap(fn ($mail) => $mail->to)
        ->map(fn ($to) => $to["address"] ?? $to->address)
        ->unique()
        ->values();

    expect($mailRecipients)->toContain($this->commercial->email)
        ->toContain($this->adminLocal->email)
        ->toContain($this->gestion->email)
        ->not->toContain($this->foreignCommercial->email);

    foreach (Mail::sent(ReceptionMail::class) as $mail) {
        expect($mail->attachments())->toBeEmpty();
    }

    Mail::assertSent(ReceptionMail::class, fn (ReceptionMail $mail) => str_contains($mail->render(), 'en pièce jointe'));
});

it('requires a document type and a PDF for movements', function () {
    $this->actingAs($this->stockUser)->post('/dashboard-stock/mouvement', [
        'type' => 'Entrée',
        'quantity' => 3,
        'product' => 'Dell Latitude 5540',
        'agency' => 'Casablanca',
    ])->assertSessionHasErrors('document_type');

    $this->actingAs($this->stockUser)->post('/dashboard-stock/mouvement', [
        'type' => 'Entrée',
        'quantity' => 3,
        'product' => 'Dell Latitude 5540',
        'agency' => 'Casablanca',
        'document_type' => 'Bon de livraison',
    ])->assertSessionHasErrors('document_file');

    expect(StockOperation::where('section', 'mouvements')->count())->toBe(0);
});

it('rejects a non-PDF document file on movements', function () {
    $this->actingAs($this->stockUser)->post('/dashboard-stock/mouvement', [
        'type' => 'Entrée',
        'quantity' => 3,
        'product' => 'Dell Latitude 5540',
        'agency' => 'Casablanca',
        'document_type' => 'Bon de livraison',
        'document_file' => UploadedFile::fake()->create('BL.txt', 100, 'text/plain'),
    ])->assertSessionHasErrors('document_file');

    expect(StockOperation::where('section', 'mouvements')->count())->toBe(0);
});

it('rejects a document file larger than 10 Mo', function () {
    $this->actingAs($this->stockUser)->post('/dashboard-stock/mouvement', [
        'type' => 'Entrée',
        'quantity' => 3,
        'product' => 'Dell Latitude 5540',
        'agency' => 'Casablanca',
        'document_type' => 'Bon de livraison',
        'document_file' => UploadedFile::fake()->create('BL-large.pdf', 11 * 1024, 'application/pdf'),
    ])->assertSessionHasErrors('document_file');

    expect(StockOperation::where('section', 'mouvements')->count())->toBe(0);
});

it('requires a document type and a PDF when creating a reception', function () {
    $this->actingAs($this->stockUser)->post('/dashboard-stock/receptions', [
        'nom' => 'Fournisseur Atlas',
        'detail' => '10 unités de papier A4',
        'agence' => 'Casablanca',
        'quantite' => 10,
    ])->assertSessionHasErrors('document_type');

    $this->actingAs($this->stockUser)->post('/dashboard-stock/receptions', [
        'nom' => 'Fournisseur Atlas',
        'detail' => '10 unités de papier A4',
        'agence' => 'Casablanca',
        'quantite' => 10,
        'document_type' => 'Bon de livraison',
    ])->assertSessionHasErrors('document_file');

    expect(StockOperation::where('section', 'receptions')->count())->toBe(0);
});

it('stores the uploaded document on a reception and attaches it to the validation email', function () {
    Mail::fake();

    $this->actingAs($this->stockUser)->post('/dashboard-stock/receptions', [
        'nom' => 'Fournisseur Atlas',
        'detail' => '10 unités de papier A4',
        'agence' => 'Casablanca',
        'quantite' => 10,
        'document_type' => 'Bon de réception',
        'document_file' => UploadedFile::fake()->create('BR-2026-001.pdf', 100, 'application/pdf'),
    ])->assertRedirect()->assertSessionHas('success');

    $reception = StockOperation::where('section', 'receptions')->firstOrFail();

    expect($reception->document_type)->toBe('Bon de réception');
    expect($reception->original_file_name)->toBe('BR-2026-001.pdf');
    expect(Storage::disk('public')->exists($reception->document_path))->toBeTrue();

    $this->actingAs($this->stockUser)->patch("/dashboard-stock/receptions/{$reception->id}/valider")
        ->assertRedirect()->assertSessionHas('success');

    expect($reception->fresh()->status)->toBe('Validée');

    Mail::assertSent(ReceptionMail::class, 3);

    foreach (Mail::sent(ReceptionMail::class) as $mail) {
        expect(count($mail->attachments()))->toBe(1);
        expect($mail->attachments()[0]->as)->toBe('BR-2026-001.pdf');
    }

    Mail::assertSent(ReceptionMail::class, fn (ReceptionMail $mail) => str_contains($mail->render(), 'Type de document') && str_contains($mail->render(), 'Bon de réception'));
    Mail::assertSent(ReceptionMail::class, fn (ReceptionMail $mail) => str_contains($mail->render(), 'BR-2026-001.pdf'));
});
