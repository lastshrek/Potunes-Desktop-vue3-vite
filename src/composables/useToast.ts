import { toast, successToast, errorToast, infoToast, warningToast } from '@/utils/toast'

export function useToast() {
	return {
		toast,
		success: successToast,
		error: errorToast,
		info: infoToast,
		warning: warningToast,
	}
}
