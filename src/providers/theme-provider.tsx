"use client";
import { ConfigProvider } from "antd";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#0E41B0",
            borderRadius: 2,
          },
          components: {
            Button: {
              controlHeight: 40,
              boxShadow: "none",
              colorPrimaryBgHover: "#0E41B0",
              colorPrimaryHover: "#0E41B0",
              controlOutline: "none",
              colorBorder: "#0E41B0",
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </div>
  );
};

export default ThemeProvider;
