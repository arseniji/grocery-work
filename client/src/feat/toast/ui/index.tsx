import { createRoot } from "react-dom/client";
import { useEffect } from "react";

interface ToastOptions {
  zIndex?: number;
  verticalPos?: "top" | "bottom" | "center";
  horizontalPos?: "left" | "right" | "center";
  position?: {
    left?: string;
    right?: string;
    top?: string;
    bottom?: string;
  };
  timeout?: number;
}

interface ProviderProps {
  options?: ToastOptions;
}

function getPositionStyle(opts?: ToastOptions): Record<string, string> {
  if (!opts) return { top: "10px", left: "50%", transform: "translateX(-50%)" };

  if (opts.position) {
    return opts.position as Record<string, string>;
  }

  const vertical = opts.verticalPos || "top";
  const horizontal = opts.horizontalPos || "center";

  const style: Record<string, string> = {};

  if (vertical === "top") style.top = "10px";
  else if (vertical === "bottom") style.bottom = "10px";
  else if (vertical === "center") {
    style.top = "50%";
    style.transform = "translateY(-50%)";
  }

  if (horizontal === "left") style.left = "10px";
  else if (horizontal === "right") style.right = "10px";
  else if (horizontal === "center") {
    style.left = "50%";
    if (style.transform) style.transform += " translateX(-50%)";
    else style.transform = "translateX(-50%)";
  }

  return style;
}

export const ToastProvider = ({ options }: ProviderProps) => {
  useEffect(() => {
    Toast.options = options || {};
  }, [options]);

  return (
    <div
      id="toast-provider"
      style={{
        position: "absolute",
        zIndex: options?.zIndex || 100,
      }}
    />
  );
};

type ToastType = "error" | "msg";

interface ShowOptions {
  title?: string;
  msg?: string;
  type: ToastType;
}

export class Toast {
  static options: ToastOptions;

  static show(options: ShowOptions) {
    const provider = document.querySelector("#toast-provider");

    if (!provider) {
      throw Error("Провайдер сообщений не установлен");
    }

    const posOptions = Toast.options;
    const positionStyle = getPositionStyle(posOptions);

    const toastContainer = document.createElement("div");
    Object.assign(toastContainer.style, {
      position: "fixed",
      zIndex: (posOptions?.zIndex || 1000).toString(),
      backgroundColor: "white",
      padding: "10px",
      borderRadius: "4px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      ...positionStyle,
    });
    provider.appendChild(toastContainer);
    const root = createRoot(toastContainer);

    switch (options.type) {
      case "error":
        root.render(<ErrorToast title={options.title} msg={options.msg} />);
        break;
      case "msg":
      default:
        root.render(<MsgToast title={options.title} msg={options.msg} />);
    }

    setTimeout(() => {
      root.unmount();
      toastContainer.remove();
    }, posOptions?.timeout || 3000);
  }
}

const MsgToast = ({ title, msg }: { title?: string; msg?: string }) => {
  return (
    <div>
      {title && <strong>{title}</strong>} {msg}
    </div>
  );
};

const ErrorToast = ({ title, msg }: { title?: string; msg?: string }) => {
  return (
    <div style={{ color: "red" }}>
      {title && <strong>{title}</strong>} {msg}
    </div>
  );
};
