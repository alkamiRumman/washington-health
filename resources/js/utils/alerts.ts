import Swal from 'sweetalert2';

export const confirmAction = async (title: string, text: string, icon: 'warning' | 'error' | 'success' | 'info' = 'warning') => {
    const result = await Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonColor: '#4f46e5', // indigo-600
        cancelButtonColor: '#6b7280', // gray-500
        confirmButtonText: 'Yes, proceed',
        background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#fff',
        color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
    });

    return result.isConfirmed;
};

export const showAlert = (title: string, text: string, icon: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    Swal.fire({
        title,
        text,
        icon,
        timer: 3000,
        timerProgressBar: true,
        background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#fff',
        color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
    });
};
