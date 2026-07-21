<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouvelle demande d'achat — SUPDATA ERP</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 40px 20px;">
    <tr>
        <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">

                {{-- Header --}}
                <tr>
                    <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 40px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.3px;">
                            SUPDATA ERP
                        </h1>
                        <p style="margin: 6px 0 0; color: #94a3b8; font-size: 13px;">
                            Nouvelle demande d'achat
                        </p>
                    </td>
                </tr>

                {{-- Body --}}
                <tr>
                    <td style="padding: 36px 40px 20px;">
                        <p style="margin: 0 0 20px; color: #334155; font-size: 15px; line-height: 1.6;">
                            Bonjour,
                        </p>
                        <p style="margin: 0 0 28px; color: #475569; font-size: 14px; line-height: 1.7;">
                            Une nouvelle demande d'achat a été soumise par <strong>{{ $creator->name }}</strong> et nécessite votre validation.
                        </p>

                        {{-- Demand Card --}}
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 28px;">
                            <tr>
                                <td style="padding: 24px 28px;">
                                    <p style="margin: 0 0 16px; color: #0f172a; font-size: 14px; font-weight: 700; letter-spacing: 0.3px;">
                                        DÉTAILS DE LA DEMANDE
                                    </p>

                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 140px; vertical-align: top;">Titre</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ $demande->title }}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">Demandeur</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ $creator->name }}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">Priorité</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ ucfirst($demande->priority) }}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">Produit principal</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ $demande->product_name ?? '—' }}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">Quantité totale</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ $demande->quantity }}</td>
                                        </tr>

                                    </table>

                                    @if($demande->description)
                                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px;">
                                        <tr>
                                            <td style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px;">
                                                <p style="margin: 0 0 4px; color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                                                    Remarque
                                                </p>
                                                <p style="margin: 0; color: #334155; font-size: 13px; line-height: 1.6;">
                                                    {{ $demande->description }}
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                    @endif
                                </td>
                            </tr>
                        </table>

                        {{-- CTA Button --}}
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                            <tr>
                                <td align="center">
                                    <a href="{{ url('/demandes/' . $demande->id) }}" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 10px;">
                                        Consulter la demande
                                    </a>
                                </td>
                            </tr>
                        </table>

                        {{-- Info Notice --}}
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; margin-bottom: 8px;">
                            <tr>
                                <td style="padding: 16px 20px;">
                                    <p style="margin: 0; color: #1e40af; font-size: 13px; line-height: 1.6;">
                                        <strong>Rappel :</strong> Vous pouvez accepter ou refuser cette demande depuis votre tableau de bord Gestion Administrative.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                {{-- Footer --}}
                <tr>
                    <td style="padding: 20px 40px 32px; text-align: center;">
                        <p style="margin: 0 0 4px; color: #94a3b8; font-size: 12px;">
                            Cordialement,
                        </p>
                        <p style="margin: 0; color: #64748b; font-size: 13px; font-weight: 600;">
                            L'équipe SUPDATA ERP
                        </p>
                    </td>
                </tr>

            </table>
        </td>
    </tr>
</table>

</body>
</html>
