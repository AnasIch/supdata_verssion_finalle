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

class DemandeConfirmedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Demande $demande,
        public User $actor,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(
                config('mail.from.address'),
                config('mail.from.name', 'SUPDATA ERP'),
            ),
            subject: "Votre demande a été approuvée — {$this->demande->title}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.demande-confirmed',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
