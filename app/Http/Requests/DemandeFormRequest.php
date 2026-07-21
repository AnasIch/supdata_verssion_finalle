<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DemandeFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['nullable', 'string', 'max:255'],
            'comment' => ['nullable', 'string', 'max:1000'],
            'priority' => ['required', 'string', 'in:low,medium,high,urgent'],
            'products' => ['required', 'array', 'min:1'],
            'products.*.product.id' => ['required', 'exists:products,id'],
            'products.*.product.name' => ['required', 'string'],
            'products.*.product.reference' => ['nullable', 'string'],
            'products.*.product.category' => ['nullable', 'string'],
            'products.*.product.unit_price' => ['nullable', 'numeric', 'min:0'],
            'products.*.quantity' => ['required', 'integer', 'min:1'],
            'products.*.observation' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'priority.required' => 'Veuillez sélectionner une priorité.',
            'priority.in' => 'Priorité invalide.',
            'products.required' => 'Ajoutez au moins un produit.',
            'products.min' => 'Ajoutez au moins un produit.',
            'products.*.product.id.required' => 'Veuillez sélectionner un produit valide.',
            'products.*.product.name.required' => 'Le nom du produit est requis.',
            'products.*.quantity.required' => 'La quantité est requise.',
            'products.*.quantity.min' => 'La quantité doit être au moins 1.',
        ];
    }
}
