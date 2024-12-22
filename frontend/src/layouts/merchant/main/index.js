import React, {useEffect, useMemo, useRef} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {jwtDecode} from "jwt-decode";
import {setToken} from "src/reducers/merchant/authSlice.js";
import {useNavigate} from "react-router-dom";
import Header from './header';

export default function MainLayout({children}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {token, loading} = useSelector(state => state.merchant.auth);
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (!token && !hasNavigated.current) {
      hasNavigated.current = true;
      navigate("/merchant/login");
      return;
    }
    if (token) {
      try {
        const data = jwtDecode(token);
        const current = Date.now() / 1000;
        if ((data.exp < current || data?.role !== "merchant") && !hasNavigated.current) {
          hasNavigated.current = true;
          dispatch(setToken(""));
          navigate("/merchant/login");
        }
      } catch (err) {
        console.error('Token validation error:', err);
        if (!hasNavigated.current) {
          hasNavigated.current = true;
          dispatch(setToken(""));
          navigate("/merchant/login");
        }
      }
    }
  }, [token, navigate, dispatch]);

  const layoutContent = useMemo(() => (
    <div className="w-full h-full bg-[#F6F6F6] p-[15px] sm:p-[32px] min-h-[100vh] flex justify-center">
      <div className="w-full max-w-[960px] flex flex-col gap-[16px] min-h-full">
        <Header/>
        <div className="flex-1 p-[15px] sm:p-[32px] bg-white rounded-[16px]">
          {children}
        </div>
      </div>
    </div>
  ), [children]);

  return layoutContent;
}