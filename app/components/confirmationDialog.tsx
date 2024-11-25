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
        // focusConfirm: false,
        allowOutsideClick: false, // Prevent closing when clicking outside
        allowEscapeKey: false,    // Prevent closing with the escape key
        backdrop: true,           // Use a backdrop to isolate the modal
        returnFocus: false,       // Prevent returning focus to the main modal
    });
    return result.isConfirmed;
};
