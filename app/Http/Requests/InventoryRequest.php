<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InventoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isStore = $this->isMethod('POST');

        $rules = [
            'date' => [$isStore ? 'required' : 'sometimes', 'date'],
            'type' => [$isStore ? 'required' : 'sometimes', Rule::in(['general', 'partial'])],
            'observation' => ['nullable', 'string', 'max:1000'],
        ];

        if ($isStore) {
            $rules['agency_id'] = ['required', 'integer', 'exists:agences,id'];
            $rules['user_id'] = ['nullable', 'integer', 'exists:users,id'];
        }

        $rules['items'] = ['sometimes', 'array', 'max:500'];
        $rules['items.*.product_id'] = ['required', 'integer', 'exists:products,id'];
        $rules['items.*.system_quantity'] = ['required', 'integer', 'min:0', 'max:1000000'];
        $rules['items.*.physical_quantity'] = ['required', 'integer', 'min:0', 'max:1000000'];
        $rules['items.*.comment'] = ['nullable', 'string', 'max:255'];

        return $rules;
    }

    public function messages(): array
    {
        return [
            'agency_id.required' => 'Veuillez sélectionner une agence.',
            'agency_id.exists' => 'Agence invalide.',
            'date.required' => 'La date est requise.',
            'date.date' => 'Date invalide.',
            'type.required' => 'Veuillez sélectionner un type.',
            'type.in' => 'Type d\'inventaire invalide.',
            'items.array' => 'Lignes d\'inventaire invalides.',
            'items.*.product_id.required' => 'Chaque ligne doit contenir un produit.',
            'items.*.product_id.exists' => 'Produit invalide.',
            'items.*.physical_quantity.required' => 'La quantité physique est requise pour chaque ligne.',
            'items.*.physical_quantity.min' => 'La quantité physique ne peut pas être négative.',
        ];
    }
}
