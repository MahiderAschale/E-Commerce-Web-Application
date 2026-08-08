declare module "@/components/ui/toast" {
    export type ToastProps = {
      id: string;
      title?: React.ReactNode;
      description?: React.ReactNode;
      action?: React.ReactNode;
    };
  
    export type ToastActionElement = React.ReactNode;
  }