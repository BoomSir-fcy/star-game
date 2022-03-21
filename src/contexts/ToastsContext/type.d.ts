interface ToastContextApi {
  toastError: ToastSignature;
  toastWarning: ToastSignature;
  toastSuccess: ToastSignature;
  toastInfo: ToastSignature;
  toastLink: ToastSignatureUrl;
}

type ToastSignature = (
  title: Toast['title'],
  description?: Toast['description'],
) => void;

type ToastSignatureUrl = (
  title: Toast['title'],
  url?: RouteComponentProps,
  urlText?: string,
  description?: Toast['description'],
) => void;
