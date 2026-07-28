<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau mouvement de stock — SUPDATA ERP</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 40px 20px;">
    <tr>
        <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">

                <tr>
                    <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 40px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700;">SUPDATA ERP</h1>
                        <p style="margin: 6px 0 0; color: #94a3b8; font-size: 13px;">Nouveau mouvement de stock</p>
                    </td>
                </tr>

                <tr>
                    <td style="padding: 36px 40px 20px;">
                        <p style="margin: 0 0 20px; color: #334155; font-size: 15px; line-height: 1.6;">Bonjour,</p>
                        <p style="margin: 0 0 28px; color: #475569; font-size: 14px; line-height: 1.7;">
                            Un nouveau mouvement de stock a été enregistré par le Responsable Stock <strong>{{ $actor->name }}</strong>.
                        </p>

                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                            <tr>
                                <td align="center">
                                    <span style="display: inline-block; background-color: {{ $type === 'Entrée' ? '#d1fae5' : '#fef3c7' }}; color: {{ $type === 'Entrée' ? '#047857' : '#92400e' }}; font-size: 13px; font-weight: 700; padding: 8px 24px; border-radius: 20px; letter-spacing: 0.3px;">
                                        {{ strtoupper($type) }}
                                    </span>
                                </td>
                            </tr>
                        </table>

                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 28px;">
                            <tr>
                                <td style="padding: 24px 28px;">
                                    <p style="margin: 0 0 16px; color: #0f172a; font-size: 14px; font-weight: 700; letter-spacing: 0.3px;">DÉTAILS DU MOUVEMENT</p>
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 140px;">Type</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ $type }}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Produit</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ $product->name }}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Catégorie</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ $product->category ?? '—' }}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Quantité</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ $type === 'Entrée' ? '+' : '−' }}{{ $quantity }}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Agence</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ $agency }}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Responsable Stock</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ $actor->name }}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Date</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-weight: 600;">{{ now()->locale('fr')->isoFormat('DD MMM YYYY — HH:mm') }}</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>

                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; margin-bottom: 8px;">
                            <tr>
                                <td style="padding: 16px 20px;">
                                    <p style="margin: 0; color: #1e40af; font-size: 13px; line-height: 1.6;">
                                        <strong>Information :</strong> Le stock du produit <strong>{{ $product->name }}</strong> a été mis à jour automatiquement.
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
