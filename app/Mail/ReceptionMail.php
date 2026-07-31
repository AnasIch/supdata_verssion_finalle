<?php

namespace App\Mail;

use App\Models\StockOperation;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class ReceptionMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public StockOperation $reception,
        public User $actor,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(
                config('mail.from.address'),
                config('mail.from.name', 'SUPDATA ERP'),
            ),
            subject: 'Nouvelle réception validée',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.reception-validated',
        );
    }

    public function attachments(): array
    {
        return $this->reception->document_path
            ? [Attachment::fromPath(Storage::disk('public')->path($this->reception->document_path))
                ->as($this->reception->original_file_name ?? basename($this->reception->document_path))]
            : [];
    }
}
