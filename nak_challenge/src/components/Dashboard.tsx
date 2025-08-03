import React from "react";
import styled from "@emotion/styled";
import { useAuthStore } from "../stores/authStore";
import { useTranslation } from "react-i18next";

// Sidebar styles
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
`;

// const Sidebar = styled.div`
//   width: 260px;
//   background: #fff;
//   border-radius: 32px 0 0 32px;
//   box-shadow: 2px 0 16px rgba(0, 0, 0, 0.04);
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   padding: 40px 0 24px 0;
//   justify-content: space-between;
// `;

// const SidebarTop = styled.div`
//   width: 100%;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
// `;

// const ProfilePic = styled.div`
//   width: 80px;
//   height: 80px;
//   border-radius: 50%;
//   background: #e0e0e0;
//   margin-bottom: 16px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 2.5rem;
//   color: #888;
// `;

// const Username = styled.div`
//   font-size: 1.2rem;
//   font-weight: 700;
//   margin-bottom: 32px;
// `;

// const NavButton = styled.button<{ active?: boolean }>`
//   width: 180px;
//   padding: 12px 0;
//   margin: 8px 0;
//   border: none;
//   border-radius: 24px;
//   background: ${({ active }) => (active ? "#000" : "#f5f5f5")};
//   color: ${({ active }) => (active ? "#fff" : "#000")};
//   font-size: 1rem;
//   font-weight: 500;
//   cursor: pointer;
//   transition: background 0.2s;
//   &:hover {
//     background: #e0e0e0;
//     color: #000;
//   }
// `;

// const LogoutButton = styled.button`
//   width: 190px;
//   padding: 14px 0;
//   background: #fff;
//   color:#000;
//   border-radius: 24px;
//   border : none;
//   font-size: 1rem;
//   font-weight: 500;
//   cursor: pointer;
//   margin-bottom: 16px;
//   transition: background 0.2s;
//   &:hover {
//     background: #e0e0e0;
//     color: #000;
//   }
// `;

// Main content styles
const Content = styled.div`
  flex: 1;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const Welcome = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  color: #222;
  margin: 0;
`;

const WelcomeText = styled.h2`
  font-size: 1.5rem;
  font-weight: 500;
  color: #222;
  margin: 0;
`;

const Message = styled.p`
  font-size: 1rem;
  color: #555;
  margin-top: 16px;
`;

const Dashboard: React.FC = () => {
  // const navigate = useNavigate();
  const userName = useAuthStore((state) => state.userName);
  // const logout = useAuthStore((state) => state.logout);
  const { t } = useTranslation();

  // const [active, setActive] = React.useState<"attributes" | "products" | null>(null);

  // const handleLogout = () => {
  //   logout();
  //   navigate("/login");
  // };

  return (
    <DashboardContainer>
      {/* <Sidebar>
        <SidebarTop>
          <ProfilePic>
            <span role="img" aria-label="profile"><i className="fa fa-user" style={{ color: "#000" }}></i></span>
          </ProfilePic>
          <Username>{userName}</Username>
          <NavButton
            active={active === "attributes"}
            onClick={() => {
              setActive("attributes")
              navigate("/attributes")
            }}
          >
            {t("logout.Attributes")}
          </NavButton>
          <NavButton
            active={active === "products"}
            onClick={() => setActive("products")}
          >
            {t("logout.Products")}
          </NavButton>
        </SidebarTop>
        <LogoutButton onClick={handleLogout}>
          <i className=" fa fa-arrow-right-from-bracket"></i>
          {t("logout.LogOut")}
        </LogoutButton>
      </Sidebar> */}
      <Content>
        <Welcome>{t("logout.helloUser")}<b>{userName}</b>!</Welcome>
        <WelcomeText>
          {t("logout.welcomeMassage")}
        </WelcomeText>
        <Message>
          {t("logout.message")}
        </Message>
      </Content>
    </DashboardContainer>
  );
};

export default Dashboard;