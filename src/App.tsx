import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Cake, Heart, PartyPopper, Moon as Balloon, Music, Camera, Laugh } from 'lucide-react';
import { useSpring, animated } from 'react-spring';
import './App.css';

// Dad jokes array
const dadJokes = [
  "I Drank a glass of water in the morning. Me - 1, African Kids - 0",
  "What does a Black man's dad have in common with Nemo? They both can't be found.",
  "What do you call a fake noodle? An impasta!",
  "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "I'm reading a book about anti-gravity. It's impossible to put down!",
  "Why don't eggs tell jokes? They'd crack each other up!",
  "I told my wife she was drawing her eyebrows too high. She looked surprised.",
  "Why did the bicycle fall over? Because it was two-tired!",
  "Why did the lion go to therapy? He found out his wife was a cheetah",
  "What do you call two monkeys that share an Amazon account? Prime mates",
  "Today, I asked my phone 'Siri, why am I still single?' and it activated the front camera",
  "When does a joke become a dad joke? When it leaves you and never comes back.",
  "Do you know the phrase 'One man's trash is another man's treasure'? It's a wonderful saying but a horrible way to find out that you were adopted.",
];

// Photo frames data
const photoFrames = [
  {
    id: 1,
    url: "/1.jpg",
    rotation: -5,
    scale: 1.1,
    delay: 0.2
  },
  {
    id: 2,
    url: "/3.jpg",
    rotation: 8,
    scale: 0.9,
    delay: 0.5
  },
  {
    id: 3,
    url: "/2.jpg",
    rotation: -10,
    scale: 1,
    delay: 0.8
  },
  {
    id: 4,
    url: "/4.jpg",
    rotation: 6,
    scale: 1.05,
    delay: 1.1
  }
];

function App() {
  const [celebrate, setCelebrate] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [balloons, setBalloons] = useState<{ id: number; x: number; color: string; size: number }[]>([]);
  const [gifts, setGifts] = useState<{ id: number; x: number; rotation: number }[]>([]);
  const { width, height } = useWindowSize();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentJoke, setCurrentJoke] = useState("");
  const [showPhotos, setShowPhotos] = useState(false);

  useEffect(() => {
    setAudio(new Audio('/nigga.mp3'));
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    if (celebrate) {
      if (audio) {
        audio.play().catch(e => console.log("Audio play failed:", e));
      }
      
      // Generate random balloons with varying sizes
      const newBalloons = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'][Math.floor(Math.random() * 16)],
        size: Math.random() * 30 + 30 // Random size between 30 and 60
      }));
      
      // Generate random gifts
      const newGifts = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        rotation: Math.random() * 360
      }));
      
      setBalloons(newBalloons);
      setGifts(newGifts);
      
      // Random dad joke
      setCurrentJoke(dadJokes[Math.floor(Math.random() * dadJokes.length)]);
      
      setTimeout(() => {
        setShowMessage(true);
      }, 800);
      
      setTimeout(() => {
        setShowPhotos(true);
      }, 2000);
    } else {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      setShowMessage(false);
      setShowPhotos(false);
      setBalloons([]);
      setGifts([]);
      setCurrentJoke("");
    }
  }, [celebrate, audio]);

  const buttonAnimation = useSpring({
    scale: celebrate ? 0.8 : 1,
    rotate: celebrate ? 360 : 0,
    config: { tension: 300, friction: 10 }
  });

  const messageAnimation = useSpring({
    opacity: showMessage ? 1 : 0,
    transform: showMessage ? 'scale(1)' : 'scale(0.5)',
    config: { tension: 200, friction: 20 }
  });

  const handleClick = () => {
    setCelebrate(!celebrate);
  };

  const handleJokeClick = () => {
    setCurrentJoke(dadJokes[Math.floor(Math.random() * dadJokes.length)]);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 overflow-hidden flex flex-col items-center justify-center">
      {celebrate && <Confetti width={width} height={height} recycle={true} numberOfPieces={600} gravity={0.15} />}
      
      {/* Floating balloons with wobble effect */}
      {balloons.map((balloon) => (
        <motion.div
          key={balloon.id}
          className="absolute wobble"
          initial={{ y: height, x: `${balloon.x}vw` }}
          animate={{ 
            y: -100,
            x: [`${balloon.x}vw`, `${balloon.x - 5}vw`, `${balloon.x + 5}vw`, `${balloon.x}vw`]
          }}
          transition={{ 
            y: {
              duration: Math.random() * 5 + 8,
              ease: "easeOut",
              delay: Math.random() * 3
            },
            x: {
              duration: 10,
              times: [0, 0.3, 0.7, 1],
              repeat: Infinity,
              repeatType: "mirror"
            }
          }}
          style={{ left: `${balloon.x}vw` }}
        >
          <Balloon size={balloon.size} color={balloon.color} fill={balloon.color} className="drop-shadow-lg" />
        </motion.div>
      ))}
      
      {/* Floating gifts with bounce effect */}
      {gifts.map((gift) => (
        <motion.div
          key={gift.id}
          className="absolute"
          initial={{ y: height, x: `${gift.x}vw`, rotate: gift.rotation, scale: 0.8 }}
          animate={{ 
            y: [height, height * 0.5, height * 0.3], 
            x: [`${gift.x}vw`, `${gift.x + (Math.random() * 20 - 10)}vw`, `${gift.x + (Math.random() * 40 - 20)}vw`],
            rotate: [gift.rotation, gift.rotation + 180, gift.rotation + 360],
            scale: [0.8, 1.2, 0.9]
          }}
          transition={{ 
            duration: Math.random() * 5 + 15,
            ease: "easeOut",
            times: [0, 0.7, 1],
            delay: Math.random() * 3
          }}
        >
          <Gift size={48} className="text-white drop-shadow-lg" fill={['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF'][Math.floor(Math.random() * 6)]} />
        </motion.div>
      ))}
      
      {/* Main content */}
      <div className="z-10 text-center p-8 w-full max-w-6xl">
        <AnimatePresence>
          {!celebrate && (
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-white mb-12 drop-shadow-lg shimmer-text"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              It's Your Special Day!
            </motion.h1>
          )}
        </AnimatePresence>
        
        <animated.button
          style={buttonAnimation}
          onClick={handleClick}
          className="relative bg-white text-purple-600 font-bold py-4 px-8 rounded-full text-xl md:text-2xl shadow-lg hover:shadow-xl transform transition duration-300 hover:scale-105 focus:outline-none"
        >
          {celebrate ? (
            <span className="flex items-center">
              <Music className="mr-2" /> Stop Celebration
            </span>
          ) : (
            <span className="flex items-center">
              <PartyPopper className="mr-2 bounce-icon" /> Click to Celebrate!
            </span>
          )}
        </animated.button>
        
        <AnimatePresence>
          {showMessage && (
            <animated.div style={messageAnimation} className="mt-12">
              <motion.div
                className="bg-white bg-opacity-90 rounded-xl p-8 shadow-2xl max-w-2xl mx-auto"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
              >
                <div className="flex justify-center mb-4">
                  <Cake size={64} className="text-pink-500 pulse" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-pink-600 mb-4 shimmer-text">Happy Birthday Dishaaaaaaaa!</h2>
                <p className="text-xl md:text-2xl text-gray-700 mb-6">
                  Wishing you very very very Happpy returns of the day... May all your dreams come true and since your my birthday twin soooo that means my dreams come true as well righttt??? cuz twin powers.. Anywaysss Have a great day and a greater year.. 🎈🎁🎊
                </p>
                <div className="flex justify-center space-x-4 mb-6">
                  <Heart size={32} className="text-red-500 pulse" fill="#f43f5e" />
                  <PartyPopper size={32} className="text-yellow-500 bounce-icon" />
                  <Gift size={32} className="text-blue-500 float" />
                  <Cake size={32} className="text-pink-500 spin-slow" />
                  <Balloon size={32} className="text-purple-500 float" />
                </div>
                
                {/* Dad joke section */}
                <div className="bg-purple-100 p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <Laugh size={24} className="text-purple-600 mr-2" />
                    <h3 className="text-xl font-bold text-purple-600">Dad Joke Alert!</h3>
                  </div>
                  <p className="text-lg text-purple-800 italic mb-3">{currentJoke}</p>
                  <button 
                    onClick={handleJokeClick}
                    className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm hover:bg-purple-600 transition-colors"
                  >
                    Another Joke!
                  </button>
                </div>
              </motion.div>
            </animated.div>
          )}
        </AnimatePresence>
        
        {/* Photo gallery */}
        <AnimatePresence>
          {showPhotos && (
            <motion.div 
              className="mt-12 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="flex justify-center mb-4">
                <div className="flex items-center bg-white bg-opacity-80 px-6 py-2 rounded-full shadow-md">
                  <Camera size={24} className="text-pink-600 mr-2" />
                  <h3 className="text-xl font-bold text-pink-600">Birthday Memories</h3>
                </div>
              </div>
              
              ...
              <div className="flex flex-wrap justify-center gap-4 p-4">
                {photoFrames.map((photo) => (
                  <motion.div
                    key={photo.id}
                    className="relative"
                    initial={{ opacity: 0, scale: 0, rotate: photo.rotation * 2 }}
                    animate={{ opacity: 1, scale: 1, rotate: photo.rotation }}
                    transition={{ 
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: photo.delay
                    }}
                    whileHover={{ 
                      scale: photo.scale + 0.1,
                      rotate: 0,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <div className="bg-white p-3 shadow-xl rounded-sm transform" style={{ transform: `rotate(${photo.rotation}deg)` }}>
                      <img 
                        src={photo.url} 
                        alt="Birthday memory" 
                        className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-sm"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 p-2 text-center text-sm font-medium text-gray-700">
                        Obviously i wasnt gonna put good looking photos right
                      </div>
                    </div>
                  </motion.div>
                ))}
                {/* Video tag */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 1.5
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="bg-white p-3 shadow-xl rounded-sm">
                    <video 
                      src="/4CB22AI017_cut.mp4" 
                      controls
                      muted
                      autoPlay 
                      className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-sm"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Decorative elements */}
      <div className="fixed bottom-0 left-0 w-full h-32 bg-contain bg-repeat-x" style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1527481138388-31827a7c94d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60')",
        opacity: 0.2
      }}></div>

            {/* Left banner */}
            <div className="fixed top-0 left-0 w-32 h-full bg-cover" style={{ 
        backgroundImage: "url('/1_banner.jpg')",
        backgroundPosition: '70% 30%',
        opacity: 0.7
      }}></div>

      {/* Right banner */}
      <div className="fixed top-0 right-0 w-32 h-full bg-cover" style={{ 
        backgroundImage: "url('/1_banner.jpg')",
        backgroundPosition: '70% 30%',
        opacity: 0.7
      }}></div>
    </div>
  );
}

export default App;