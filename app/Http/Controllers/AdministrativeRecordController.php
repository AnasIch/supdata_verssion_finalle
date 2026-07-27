<?php

namespace App\Http\Controllers;

use App\Models\AdministrativeRecord;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdministrativeRecordController extends Controller
{
    private const TYPES = ['documents', 'notes', 'contrats'];
    public function __construct(private AuditLogService $audit) {}

    public function index(string $type, Request $request) {
        abort_unless(in_array($type, self::TYPES, true), 404);
        $user = $request->user()->loadMissing(['role', 'agency']);
        return Inertia::render('Administrative/Records', [
            'type' => $type, 'user' => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email, 'role' => $user->role?->name, 'agency' => $user->agency?->name],
            'records' => AdministrativeRecord::with(['agency', 'creator'])->where('type', $type)->latest()->get(),
        ]);
    }

    public function store(string $type, Request $request) {
        abort_unless(in_array($type, self::TYPES, true), 404);
        $data = $this->validated($request);
        $record = AdministrativeRecord::create($data + ['type' => $type, 'reference' => strtoupper(substr($type, 0, 3)).'-'.now()->format('ymdHis'), 'created_by' => $request->user()->id]);
        $this->log($request, 'Création', $record); return back()->with('success', 'Élément créé.');
    }

    public function update(string $type, AdministrativeRecord $record, Request $request) {
        abort_unless($record->type === $type && in_array($type, self::TYPES, true), 404);
        $record->update($this->validated($request)); $this->log($request, 'Modification', $record); return back()->with('success', 'Élément modifié.');
    }

    public function destroy(string $type, AdministrativeRecord $record, Request $request) {
        abort_unless($record->type === $type, 404); $this->log($request, 'Suppression', $record); $record->delete(); return back()->with('success', 'Élément supprimé.');
    }

    private function validated(Request $request): array { return $request->validate([
        'title' => ['required','string','max:255'], 'description' => ['nullable','string','max:3000'],
        'status' => ['required','string','max:50'], 'agency_id' => ['nullable','exists:agences,id'],
        'effective_at' => ['nullable','date'], 'expires_at' => ['nullable','date','after_or_equal:effective_at'],
    ]); }
    private function log(Request $request, string $action, AdministrativeRecord $record): void { $this->audit->log(
        user: $request->user(), action: $action, module: 'Gestion administrative', description: "$action {$record->type} : {$record->title}",
        target: $record->reference, ipAddress: $request->ip(), userAgent: $request->userAgent()
    ); }
}
