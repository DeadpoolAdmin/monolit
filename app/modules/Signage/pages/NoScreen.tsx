import React from "react";
import { Button } from '@/shared/components/Button/Button';

import '@/modules/Signage/styles/no_screen.scss'
import { reloadApp } from "@/shared/hooks/useReload";

const NoScreen = () => {


  return (
    <div className="no_screen" style={{
        height:  'var(--screen-height)',
    }}>
      <div className="no_screen__container">
        <div className="container__title">
          <span>Screen Not Assigned</span>
        </div>
        <div className="container__subtitle">
          <span>
            It looks like this device hasn't been assigned to any screen yet.
          </span>
        </div>

        <div className="container__actions">
          <div className="actions__title">
            <span><b>Actions you can take</b></span>
          </div>
          <div className="actions__list">
            <ol>
              <li>
                <b>1.</b>
                <span>
                    Open the <b>Digital Signage</b>tab in your admin panel
                </span>
              </li>
              <li>
                <b>2.</b>
                <span>
                  Find your device and open its <b>Action List</b>
                </span>
              </li>
              <li>
                <b>3.</b>
                <span>
                  Click <b>“Assign Screen”</b>
                </span>
              </li>

              <li>
                <b>4.</b>
                <span>
                  Choose an <b>existing screen</b>
                </span>
              </li>
              <li>
                <b>5.</b>
                <span>
                  Click <b>“Save”</b> to apply the changes
                </span>
              </li>
              <li>
                <span>
                  <b>6.</b>
                </span>
                <span>Wait a few seconds for it to refresh automatically</span>
              </li>
            </ol>
          </div>
        </div>

        <Button
          minWidth="28"
          maxWidth="35"
          isActive={true}
          ok={() => {
            reloadApp();
          }}
          back={() => {}}
        >
          <span className="button-text">Reload</span>
        </Button>
      </div>
    </div>
  );
};

export default NoScreen;
