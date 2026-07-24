<?php

namespace App\Mail;

use App\Models\Demande;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NouvelleDemandeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Demande $demande,
        public User $creator,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(
                config('mail.from.address'),
                config('mail.from.name', 'SUPDATA ERP'),
            ),
            subject: "Nouvelle demande d'achat — {$this->demande->title}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.nouvelle-demande',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
