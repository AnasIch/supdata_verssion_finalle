<?php

namespace App\Mail;

use App\Models\Reservation;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReservationCancelledMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Reservation $reservation,
        public User $actor,
        public string $reason,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(
                config('mail.from.address'),
                config('mail.from.name', 'SUPDATA ERP'),
            ),
            subject: "Réservation annulée — {$this->reservation->reference}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.reservation-cancelled',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
