import React, { useState, useEffect } from 'react';
import GoogleLogin from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import bgVideo from '../assets/share.mp4';
import treasureMono from '../assets/treasure_mono.svg'
import { client } from '../client';
import Cookies from '../components/Cookies';
import Spinner from '../components/Spinner';

const Login = () => {
  const [showCookieConsent, setShowCookieConsent] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const navigate = useNavigate();

  const cookieStorage = {
    getItem: (item) => {
      const cookies = document.cookie
        .split(';')
        .map(cookie => cookie.split('='))
        .reduce((acc, [key, value]) => ({ ...acc, [key.trim()]: value }), {});
      return cookies[item];
    },
    setItem: (item, value) => {
      document.cookie = `${item}=${value};`
    }
  }

  useEffect(() => {
    const consent = cookieStorage.getItem('treasure_consent');

    if (consent) {
      setShowCookieConsent(false);
    }

  }, [])

  const storeCookie = () => {
    cookieStorage.setItem('treasure_consent', true);
    setShowCookieConsent(false);
  }

  const responseGoogle = response => {
    // console.log(response)
    setLoggingIn(true);
    localStorage.setItem('user', JSON.stringify(response.profileObj));
    const { name, googleId, imageUrl, email } = response.profileObj;

    const doc = {
      _id: googleId,
      _type: 'user',
      username: name,
      email: email,
      image: imageUrl
    }

    client.createIfNotExists(doc)
      .then(() => {
        navigate('/', { replace: true })
        setLoggingIn(false);
      })
      .catch(err => {
        setLoggingIn(false);
        alert(err)
      })
  }

  const failureLogin = () => {
    setLoggingIn(false);

  }

  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className="relative w-full h-full">
        <video src={bgVideo} type="video/mp4" loop muted autoPlay
          className='w-full h-full object-cover' />
        <div className="absolute flex flex-col justify-center items-center top-0 left-0 bottom-0 right-0 bg-blackOverlay">
          <div className="p-5">
            <img src={treasureMono} width="150px" alt="logo" />
          </div>
          {loggingIn ?
            <Spinner message="Redirecting..." color='text-white' />
            :
            <div className="shadow-2x1">
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                render={(renderProps) => (
                  <button
                    type="button"
                    className='bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none'
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <FcGoogle className='mr-4' /> Sign in with Google
                  </button>
                )}
                onSuccess={responseGoogle}
                onFailure={failureLogin}
                cookiePolicy='single_host_origin'
              />
            </div>
          }

          {showCookieConsent &&
            <div className="md:absolute md:bottom-[5%] mt-20 md:mt-0">
              <Cookies storeCookie={storeCookie} />
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Login;