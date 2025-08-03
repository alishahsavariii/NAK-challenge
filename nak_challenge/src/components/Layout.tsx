import React from "react";
import styled from "@emotion/styled";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore"; 
import Sidebar from "./Sidebar";

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
`;

const Content = styled.div`
  flex: 1;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const SidebarContainer = styled.div`
  width: 260px;
  background: #fff;
  border-radius: 32px 0 0 32px;
  box-shadow: 2px 0 16px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0 24px 0;
  justify-content: space-between;
`;

const Layout: React.FC = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn); 

  if (!isLoggedIn) {
    return <Navigate to="/login" />; 
  }

  return (
    <LayoutContainer>
      <SidebarContainer>
        <Sidebar /> 
      </SidebarContainer>
      <Content>
        <Outlet />
      </Content>
    </LayoutContainer>
  );
};

export default Layout;
