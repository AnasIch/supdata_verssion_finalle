<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SystemNotification extends Notification
{
    use Queueable;

    public function __construct(
        public string $title,
        public string $description,
        public string $type = 'info',
        public string $source = 'system',
        public ?string $actionUrl = null,
        public array $context = [],
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $mail = (new MailMessage)
            ->subject("SUPDATA ERP — {$this->title}")
            ->greeting("Bonjour {$notifiable->name},")
            ->line($this->description);

        if (!empty($this->context)) {
            $mail->line("");
            $mail->line("**Détails de la réservation :**");

            if (!empty($this->context['reference'])) {
                $mail->line("Référence : {$this->context['reference']}");
            }
            if (!empty($this->context['client_name'])) {
                $mail->line("Client : {$this->context['client_name']}");
            }
            if (!empty($this->context['product_name'])) {
                $mail->line("Produit : {$this->context['product_name']}");
            }
            if (!empty($this->context['product_reference'])) {
                $mail->line("Référence produit : {$this->context['product_reference']}");
            }
            if (!empty($this->context['category'])) {
                $mail->line("Catégorie : {$this->context['category']}");
            }
            if (!empty($this->context['quantity'])) {
                $mail->line("Quantité réservée : {$this->context['quantity']}");
            }
            if (!empty($this->context['agency_name'])) {
                $mail->line("Agence d'origine : {$this->context['agency_name']}");
            }
            if (!empty($this->context['creator_name'])) {
                $mail->line("Créée par : {$this->context['creator_name']}");
            }
            if (!empty($this->context['available_after'])) {
                $mail->line("Stock restant après réservation : {$this->context['available_after']}");
            }
            if (!empty($this->context['remark'])) {
                $mail->line("Remarque : {$this->context['remark']}");
            }
        }

        if ($this->actionUrl) {
            $url = config('app.url') . $this->actionUrl;
            $mail->action('Voir la réservation', $url);
        }

        return $mail->line('Ceci est un message automatique du système SUPDATA ERP.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => $this->title,
            'description' => $this->description,
            'type' => $this->type,
            'source' => $this->source,
            'action_url' => $this->actionUrl,
            'context' => $this->context,
        ];
    }
}
