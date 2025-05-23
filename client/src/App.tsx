import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProblemSet from "./pages/ProblemSet";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import AdminPage from "./pages/AdminPage";
import MarketplacePage from "./pages/MarketplacePage";
import ListProductPage from "./pages/ListProductPage";
import { PrivateRoutes } from "./ProtectedRoutes";
import { Layout, LayoutTwo } from "./Layout";
import WalletPage from "./pages/Wallet.jsx";
import { PaymentForm } from "./pages/Payment";
import UserQuestionDashBoard from "./pages/UserQuestionDashBoard";
import ContestPage from "./pages/ContestPage";
import ProfilePage from "./pages/ProfilePage";
import ContestPageCommunity from "./pages/CommunityContest";
import JoinContestCommunity from "./pages/JoinCommunityContest";
import AdminDashboard from "./pages/adminDashboardPage";
import UnverifiedUsersDashboard from "./pages/EditorPage";
import QuizCreation from "./pages/quizcreatePage";
import QuizPageCommunity from "./pages/communityQuizPage";
import QuizPage from "./pages/quizpage";
import QuizSolving from "./pages/userquizDashboard";
import QuizAdminDashboard from "./pages/joinquizCommunityPage";
import CreateRecruitmentDrive from "./pages/recruitmentCreate";
import RecruitmentPage from "./pages/recruitmentPage";
import RecruitmentDashboard from "./pages/recruitmentDashboard";
import RecruitmentInvite from "./pages/recruitmentInvitePage";
import UserRecruitmentPage from "./pages/userRecruitmentPage";
import Dashboard from "./pages/adminDashboardPage";
import UserRecruitmentDashboard from "./pages/userRecruitmentDashboardPage";
import CompanyDashboard from "./pages/companyDashboard";

export const TOKEN_STORAGE_KEY = "authToken";
export const ID_STORAGE_KEY = "id";
export const API_URL = "https://polycode-arena-backend.vercel.app/";

function App() {
    const [token, setToken] = useState(localStorage.getItem(TOKEN_STORAGE_KEY));
    const [id, setId] = useState(localStorage.getItem(ID_STORAGE_KEY));

    const changeToken = (string: string) => {
        setToken(string);
    };
    const changeId = (string: string) => {
        setId(string);
    };

    useEffect(() => {
        if (token) {
            localStorage.setItem(TOKEN_STORAGE_KEY, token);
        } else {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
        if (id) {
            localStorage.setItem(ID_STORAGE_KEY, id);
        } else {
            localStorage.removeItem(ID_STORAGE_KEY);
        }
    }, [token, id]);

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />

                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />

                    {/* this is route of community */}

                    <Route element={<Layout />}>
                        <Route element={<PrivateRoutes role={"C"} />}>
                            <Route
                                path="/community/create"
                                element={<AdminPage />}
                            />
                            <Route
                                path="/community/problemset"
                                element={
                                    <ProblemSet
                                        token=""
                                        initialCode=""
                                        questions={[]}
                                        setOutput={function (
                                            output: string
                                        ): void {
                                            throw new Error(
                                                "Function not implemented."
                                            );
                                        }}
                                    />
                                }
                            />
                            <Route
                                path="/community/listproduct"
                                element={<ListProductPage />}
                            />
                            <Route
                                path="/community/recruitment/create"
                                element={<CreateRecruitmentDrive />}
                            />
                            <Route
                                path="/community/recruitment/"
                                element={<RecruitmentPage />}
                            />
                            <Route
                                path="/community/marketplace"
                                element={<MarketplacePage />}
                            />
                            <Route
                                path="/dashboard"
                                element={<AdminDashboard />}
                            />
                            <Route
                                path="/community/leaderboard"
                                element={<AdminDashboard />}
                            />
                            <Route
                                path="/community/wallet"
                                element={<WalletPage />}
                            />
                            <Route
                                path="/community/contest"
                                element={<ContestPageCommunity />}
                            />
                            <Route
                                path="/community/dashboard"
                                element={<CompanyDashboard />}
                            />
                            <Route
                                path="/community/create/quiz"
                                element={<QuizCreation />}
                            />
                            <Route
                                path="/community/quizzes"
                                element={<QuizPageCommunity />}
                            />
                            <Route
                                path="/community/join/:contest_id"
                                element={<JoinContestCommunity />}
                            />
                            <Route
                                path="/community/recruitment/:recruitment_id"
                                element={<RecruitmentDashboard />}
                            />
                            <Route
                                path="community/recruitment/:recruitment_id/inviteusers"
                                element={<RecruitmentInvite />}
                            />

                            <Route
                                path="/community/quiz/:quiz_id"
                                element={<QuizAdminDashboard />}
                            />
                            <Route
                                path="/community/verification"
                                element={<UnverifiedUsersDashboard />}
                            />

                            <Route
                                path="/community/pay/:receiverid"
                                element={<PaymentForm />}
                            />
                        </Route>
                    </Route>

                    {/* this is route of user */}

                    <Route element={<LayoutTwo />}>
                        <Route element={<PrivateRoutes role={"U"} />}>
                            <Route
                                path="/user/marketplace"
                                element={<MarketplacePage />}
                            />

                            <Route
                                path="/user/contests"
                                element={<ContestPage />}
                            />
                            <Route
                                path="/user/recruitment/"
                                element={<UserRecruitmentPage />}
                            />
                            <Route path="/user/quiz" element={<QuizPage />} />
                            <Route
                                path="/leaderboard"
                                element={<Dashboard />}
                            />

                            <Route
                                path="/user/join/:contest_id"
                                element={<UserQuestionDashBoard />}
                            />
                            <Route
                                path="/user/quiz/join/:quiz_id"
                                element={<QuizSolving />}
                            />
                            <Route
                                path="/user/wallet"
                                element={<WalletPage />}
                            />

                            <Route
                                path="/user/profile"
                                element={<ProfilePage />}
                            />

                            <Route
                                path="/user/pay/:receiverid"
                                element={<PaymentForm />}
                            />
                            <Route
                                path="/user/recruitment/:recruitment_id"
                                element={<UserRecruitmentDashboard/>}
                            />
                        </Route>
                    </Route>

                    <Route
                        path="*"
                        element={
                            <ErrorPage
                                data={{
                                    header: "404",
                                    message: "Page not found.",
                                    links: [
                                        { text: "Main Page", link_path: "/" },
                                        {
                                            text: "Dashboard",
                                            link_path: "/dashboard",
                                        },
                                    ],
                                }}
                            />
                        }
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
