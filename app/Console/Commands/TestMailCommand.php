<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Support\Facades\Mail;

#[Signature('mail:test {--to= : Adresse email pour le test')]
#[Description('Envoyer un email de test pour vérifier la configuration Gmail SMTP')]
class TestMailCommand extends Command
{
    public function handle(): int
    {
        $to = $this->option('to') ?: config('mail.from.address');

        if (empty($to)) {
            $this->error('Aucune adresse email définie. Utilisez : php artisan mail:test --to=votre@email.com');
            return static::FAILURE;
        }

        $this->info("Envoi d'un email de test à {$to}...");

        try {
            Mail::raw(
                "Ceci est un email de test envoyé par SUPDATA ERP.\n\n"
                . "Si vous recevez ce message, la configuration Gmail SMTP fonctionne correctement.\n\n"
                . "Date : " . now()->locale('fr')->isoFormat('DD MMM YYYY — HH:mm'),
                function ($message) use ($to) {
                    $message
                        ->to($to)
                        ->subject('Test SMTP — SUPDATA ERP');
                }
            );

            $this->info("Email envoyé avec succès à {$to}.");
            return static::SUCCESS;
        } catch (\Exception $e) {
            $this->error("Échec de l'envoi : " . $e->getMessage());
            return static::FAILURE;
        }
    }
}
