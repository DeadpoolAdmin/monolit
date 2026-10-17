import React, { Component, ReactNode, ErrorInfo } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import "./index.scss";
import { reloadApp } from "@/shared/hooks/useReload";

import error from "@/assets/boundary.png";
import { Button } from '@/shared/components/Button/Button';

interface ErrorBoundaryProps extends WithTranslation {
  children: ReactNode;
  fallbackUI?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private boundGoToMenu?: (e: KeyboardEvent) => void;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
    this.goToMenu = this.goToMenu.bind(this);
  }

  goToMenu(e: MouseEvent | KeyboardEvent): void {
    if (!this.state.hasError) return;

    if (
      e.type === "click" ||
      (e.type === "keydown" && (e as KeyboardEvent).key === "Enter")
    ) {
      try {
        reloadApp();
      } catch (err) {
        console.error("Error restarting app:", err);
      }
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ hasError: true, error, errorInfo });
  }

  handleGlobalError = (event: ErrorEvent): void => {
    console.error("Global error caught:", event.error);

    if (event.error?.name === "TypeMismatchError") {
      console.warn("Tizen API received incorrect argument type.");
    }

    console.error("Global error caught:", event.error);
    this.setState({ hasError: true, error: event.error, errorInfo: null });
  };

  handlePromiseRejection = (event: PromiseRejectionEvent): void => {
    console.error("Unhandled Promise Rejection:", event.reason);
    this.setState({ hasError: true, error: event.reason, errorInfo: null });
  };

  componentDidMount(): void {
    this.boundGoToMenu = (e: KeyboardEvent) => this.goToMenu(e);
    window.addEventListener("keydown", this.boundGoToMenu);
    window.addEventListener("error", this.handleGlobalError);
    window.addEventListener("unhandledrejection", this.handlePromiseRejection);
  }

  componentWillUnmount(): void {
    if (this.boundGoToMenu) {
      window.removeEventListener("keydown", this.boundGoToMenu);
    }
    window.removeEventListener("error", this.handleGlobalError);
    window.removeEventListener(
      "unhandledrejection",
      this.handlePromiseRejection
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallbackUI || (
          <div
            className="boundary__container"
            style={{
              height: window.innerHeight + "px",
            }}
          >
            <div className="container__content">
              <div className="content__image">
                <img src={error} alt="Error" className="error-image" />
              </div>

              <div className="content__text">
                <span>{this.props.t('pageNotAvailableTryReload')}</span>
              </div>

              <div className="content__button">
                <Button
                   isActive={true}
                   ok={reloadApp}
                   style={{
                    border: '.2rem solid white',
                    background: 'transparent',
                    minWidth: '30rem',
                    marginTop: '5rem'
                   }}
                >
                  <span>{this.props.t('reload')}</span>
                </Button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary);
