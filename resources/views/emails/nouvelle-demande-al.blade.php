<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouvelle demande à traiter — SUPDATA ERP</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 40px 20px;">
    <tr>
        <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">

                <tr>
                    <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 40px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700;">SUPDATA ERP</h1>
                        <p style="margin: 6px 0 0; color: #94a3b8; font-size: 13px;">Nouvelle demande à traiter</p>
                    </td>
                </tr>

                <tr>
                    <td style="padding: 36px 40px 20px;">
                        <p style="margin: 0 0 20px; color: #334155; font-size: 15px; line-height: 1.6;">Bonjour,</p>
                        <p style="margin: 0 0 28px; color: #475569; font-size: 14px; line-height: 1.7;">
                            Une nouvelle demande validée par la Gestion Administrative nécessite votre décision.
                        </p>

                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 28px;">
                            <tr>
                                <td style="padding: 24px 28px;">
                                    <p style="margin: 0 0 16px; color: #0f172a; font-size: 14px; font-weight: 700; letter-spacing: 0.3px;">DÉTAILS DE LA DEMANDE</p>
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 140px;">Référence</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ $demande->title }}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Produit</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ $demande->product_name ?? '—' }}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Agence</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ $demande->agency->name ?? '—' }}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Quantité</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ $demande->quantity }}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Priorité</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ ucfirst($demande->priority) }}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Validée par</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ $validator->name }}</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>

                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                            <tr>
                                <td align="center">
                                    <a href="{{ url('/dashboard-admin-local/demandes/' . $demande->id) }}" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 10px;">
                                        Traiter la demande
                                    </a>
                                </td>
                            </tr>
                        </table>

                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; margin-bottom: 8px;">
                            <tr>
                                <td style="padding: 16px 20px;">
                                    <p style="margin: 0; color: #1e40af; font-size: 13px; line-height: 1.6;">
                                        <strong>Rappel :</strong> Vous pouvez confirmer ou rejeter cette demande depuis votre tableau de bord Administrateur Local.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td style="padding: 20px 40px 32px; text-align: center;">
                        <p style="margin: 0 0 4px; color: #94a3b8; font-size: 12px;">Cordialement,</p>
                        <p style="margin: 0; color: #64748b; font-size: 13px; font-weight: 600;">L'équipe SUPDATA ERP</p>
                    </td>
                </tr>

            </table>
        </td>
    </tr>
</table>

</body>
</html>
