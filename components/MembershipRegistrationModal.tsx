import React, { useState } from 'react';
import Modal from './Modal';
import { Organization } from '../types';

interface MembershipRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { studentName: string; studentClass: string; reason: string; }) => void;
  organization: Organization;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & {label: string}> = ({label, ...props}) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1">{label}</label>
        <input
            id={props.name}
            type="text"
            {...props}
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary focus:border-primary dark:focus:border-dark-primary transition-colors bg-slate-50 dark:bg-slate-700 text-text-primary dark:text-dark-text-primary"
        />
    </div>
);

const TextAreaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & {label: string}> = ({label, ...props}) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1">{label}</label>
        <textarea
            id={props.name}
            rows={3}
            {...props}
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary focus:border-primary dark:focus:border-dark-primary transition-colors bg-slate-50 dark:bg-slate-700 text-text-primary dark:text-dark-text-primary"
        />
    </div>
);

const MembershipRegistrationModal: React.FC<MembershipRegistrationModalProps> = ({ isOpen, onClose, onSubmit, organization }) => {
    const [formData, setFormData] = useState({
        studentName: '',
        studentClass: '',
        reason: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            onSubmit(formData);
            setIsLoading(false);
        }, 1000);
    };

    const isFormValid = formData.studentName && formData.studentClass && formData.reason;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={handleSubmit}
            isConfirming={isLoading || !isFormValid}
            title={`Daftar ke ${organization.name}`}
            confirmText="Kirim Pendaftaran"
        >
            <p className="mb-6 text-sm text-text-secondary dark:text-slate-300">Isi data di bawah ini untuk mengajukan diri sebagai anggota baru.</p>
            <div className="space-y-4">
                <InputField label="Nama Lengkap" name="studentName" value={formData.studentName} onChange={handleChange} placeholder="Masukkan nama lengkap Anda" required />
                <InputField label="Kelas" name="studentClass" value={formData.studentClass} onChange={handleChange} placeholder="Contoh: XI TKJ 2" required />
                <TextAreaField label="Alasan Bergabung" name="reason" value={formData.reason} onChange={handleChange} placeholder="Jelaskan mengapa Anda tertarik untuk bergabung." required />
            </div>
        </Modal>
    );
};

export default MembershipRegistrationModal;