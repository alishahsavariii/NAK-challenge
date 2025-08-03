import React from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useTranslation } from "react-i18next";

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
  height : 700px
`;


const NavButton = styled.button<{ active?: boolean }>`
  width: 180px;
  padding: 12px 0;
  margin: 8px 0;
  border: none;
  border-radius: 24px;
  background: ${({ active }) => (active ? "#000" : "#f5f5f5")};
  color: ${({ active }) => (active ? "#fff" : "#000")};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #e0e0e0;
    color: #000;
  }
`;
const SidebarTop = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Username = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 32px;
`;
const ProfilePic = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #e0e0e0;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #888;
`;
const LogoutButton = styled.button`
  width: 190px;
  padding: 14px 0;
  background: #fff;
  color:#000;
  border-radius: 24px;
  border : none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 16px;
  transition: background 0.2s;
  &:hover {
    background: #e0e0e0;
    color: #000;
  }
`;


const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const userName = useAuthStore((state) => state.userName);
    const logout = useAuthStore((state) => state.logout);
    const { t } = useTranslation();
    const [active, setActive] = React.useState<"attributes" | "products" | null>(null);


    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <SidebarContainer>
            <SidebarTop>
                <ProfilePic>
                    <span role="img" aria-label="profile"><i className="fa fa-user" style={{ color: "#000" }}></i></span>
                </ProfilePic>
                <Username>{userName}</Username>
                <NavButton active={active === "attributes"}
                    onClick={() => {
                        navigate("/attributes")
                        setActive("attributes")
                    }}
                >
                    {t("logout.Attributes")}
                </NavButton>
                <NavButton
                    active={active === "products"}
                    onClick={() => {
                        setActive("products")
                        navigate("/products")
                    }}>
                    {t("logout.Products")}
                </NavButton>
            </SidebarTop>
            <LogoutButton onClick={handleLogout}>
                <i className=" fa fa-arrow-right-from-bracket"></i>
                {t("logout.LogOut")}
            </LogoutButton>
        </SidebarContainer>
    );
};

export default Sidebar;
