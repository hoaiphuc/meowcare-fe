// confirmationDialog.ts

import Swal from 'sweetalert2';

interface ConfirmationDialogOptions {
    title: string;
    text?: string;
    confirmButtonText?: string;
    denyButtonText?: string;
    confirmButtonColor?: string;
    denyButtonColor?: string;
}

export const showConfirmationDialog = async (
    options: ConfirmationDialogOptions
): Promise<boolean> => {
    const result = await Swal.fire({
        title: options.title,
        text: options.text || '',
        showDenyButton: true,
        confirmButtonText: options.confirmButtonText || 'Yes',
        denyButtonText: options.denyButtonText || 'No',
        confirmButtonColor: options.confirmButtonColor || '#3085d6',
        denyButtonColor: options.denyButtonColor || '#d33',
    });
    console.log(result.isConfirmed);

    return result.isConfirmed;
};
