import { useForm } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import { Button } from "@/Components/UI/Button";
import { Input } from "@/Components/UI/Input";

export default function ConfirmPassword() {
 const {data,setData,post,processing,errors}=useForm({password:""});
 return <AuthLayout><form onSubmit={e=>{e.preventDefault();post('/confirm-password')}} className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-xl bg-white p-8 shadow"><h1 className="text-2xl font-bold">Confirmer le mot de passe</h1><p className="text-sm text-slate-500">Confirmez votre mot de passe avant de continuer.</p><Input type="password" value={data.password} onChange={e=>setData('password',e.target.value)} required autoFocus/>{errors.password&&<p className="text-sm text-red-600">{errors.password}</p>}<Button disabled={processing}>Confirmer</Button></form></AuthLayout>;
}
