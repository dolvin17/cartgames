import toast from "react-hot-toast"

export const toastSuccess = (message: string) => toast.success(message)
export const toastError = (message: string) => toast.error(message)
export const toastLoading = (message: string) => toast.loading(message)
export const toastDismiss = (id: any) => toast.dismiss(id)

export const toastNotConnected = () =>
  toastError("Cannot find a wallet to connect")
export const toastTxComplete = () => toastSuccess("Transaction complete!")
