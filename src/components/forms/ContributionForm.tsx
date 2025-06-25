import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import { Button } from './Button';
import { useAuth } from '@/hooks/useAuth';

const contributionSchema = z.object({
  text: z.string().min(3, "Le texte est requis").optional(),
  monumentId: z.string().min(1, "Le monument est requis"),
});

type ContributionFormData = z.infer<typeof contributionSchema>;

interface ContributionFormProps {
  monuments: { id: string; name: string }[];
  onSubmit: (data: ContributionFormData) => void;
  onCancel?: () => void;
}

export function ContributionForm({ monuments, onSubmit, onCancel }: ContributionFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ContributionFormData>({
    resolver: zodResolver(contributionSchema),
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const submitHandler = (data: ContributionFormData) => {
    onSubmit({
      ...data,
      file: selectedFile,
    });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <InputField
        label="Texte"
        name="text"
        register={register}
        error={errors.text}
        textarea
      />
      
      <SelectField
        label="Monument"
        name="monumentId"
        register={register}
        error={errors.monumentId}
        options={monuments.map(m => ({ value: m.id, label: m.name }))}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Fichier (optionnel)
        </label>
        <input
          type="file"
          accept="image/*,video/*,.pdf"
          onChange={handleFileChange}
          className="mt-1 block w-full"
        />
        {selectedFile && (
          <p className="mt-2 text-sm text-gray-500">
            Fichier sélectionné: {selectedFile.name}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="secondary">
            Annuler
          </Button>
        )}
        <Button type="submit">Envoyer</Button>
      </div>
    </form>
  );
}
