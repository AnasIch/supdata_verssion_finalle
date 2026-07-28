<?php

namespace App\Mail;

use App\Models\Product;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StockMovementMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $type,
        public Product $product,
        public int $quantity,
        public string $agency,
        public User $actor,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(
                config('mail.from.address'),
                config('mail.from.name', 'SUPDATA ERP'),
            ),
            subject: 'Nouveau mouvement de stock',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.stock-movement',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
