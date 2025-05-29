// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, Sparkles, Film, Clock, Calendar, Shield } from 'lucide-react';

// interface RecommendationQuizProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (preferences: RecommendationPreferences) => void;
// }

// interface RecommendationPreferences {
//   genre?: string;
//   release_year_from?: number;
//   release_year_to?: number;
//   duration_max?: number;
//   include_premium?: boolean;
// }

// const RecommendationQuiz: React.FC<RecommendationQuizProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
// }) => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [preferences, setPreferences] = useState<RecommendationPreferences>({
//     genre: '',
//     release_year_from: undefined,
//     release_year_to: undefined,
//     duration_max: undefined,
//     include_premium: true,
//   });

//   const totalSteps = 4;

//   const genres = [
//     'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror','Romance', 'Sci-Fi', 
//   ];

//   const handleNext = () => {
//     if (currentStep < totalSteps) {
//       setCurrentStep(currentStep + 1);
//     } else {
//       onSubmit(preferences);
//       handleClose();
//     }
//   };

//   const handlePrevious = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const handleClose = () => {
//     setCurrentStep(1);
//     setPreferences({
//       genre: '',
//       release_year_from: undefined,
//       release_year_to: undefined,
//       duration_max: undefined,
//       include_premium: true,
//     });
//     onClose();
//   };

//   const handleGenreSelect = (genre: string) => {
//     setPreferences({ ...preferences, genre });
//   };

//   const handleYearRangeSelect = (from: number, to: number) => {
//     setPreferences({ 
//       ...preferences, 
//       release_year_from: from, 
//       release_year_to: to 
//     });
//   };

//   const handleDurationSelect = (maxDuration: number) => {
//     setPreferences({ ...preferences, duration_max: maxDuration });
//   };

//   const handlePremiumSelect = (includePremium: boolean) => {
//     setPreferences({ ...preferences, include_premium: includePremium });
//   };

//   const isStepComplete = () => {
//     switch (currentStep) {
//       case 1: return preferences.genre !== '';
//       case 2: return preferences.release_year_from !== undefined;
//       case 3: return preferences.duration_max !== undefined;
//       case 4: return preferences.include_premium !== undefined;
//       default: return false;
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           {/* Backdrop */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="absolute inset-0 backdrop-blur-xs bg-gradient-to-br from-black via-zinc-900"
//             onClick={handleClose}
//           />
          
//           {/* Modal */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.8, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.8, y: 20 }}
//             className="relative backdrop-blur-sm bg-gradient-to-br from-black via-zinc-900 rounded-xl p-6 w-full max-w-md mx-4 border border-gray-700"
//           >
//             {/* Header */}
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-2">
//                 <Sparkles className="text-red-500" size={24} />
//                 <h2 className="text-xl font-bold text-white">Find Your Perfect Movie</h2>
//               </div>
//               <button
//                 onClick={handleClose}
//                 className="text-gray-400 hover:text-white transition-colors"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             {/* Progress Bar */}
//             <div className="mb-6">
//               <div className="flex justify-between text-sm text-gray-400 mb-2">
//                 <span>Step {currentStep} of {totalSteps}</span>
//                 <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
//               </div>
//               <div className="w-full bg-gray-700 rounded-full h-2">
//                 <motion.div
//                   className="bg-red-500 h-2 rounded-full"
//                   initial={{ width: '25%' }}
//                   animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
//                   transition={{ duration: 0.3 }}
//                 />
//               </div>
//             </div>

//             {/* Question Content */}
//             <div className="mb-6 min-h-[250px]">
//               {currentStep === 1 && (
//                 <motion.div
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   className="space-y-4"
//                 >
//                   <div className="flex items-center gap-2 mb-4">
//                     <Film className="text-red-500" size={20} />
//                     <h3 className="text-lg font-semibold text-white">What genre suits your mood?</h3>
//                   </div>
//                   <div className="grid grid-cols-2 gap-2">
//                     {genres.map((genre) => (
//                       <button
//                         key={genre}
//                         onClick={() => handleGenreSelect(genre)}
//                         className={`p-3 rounded-lg text-sm font-medium transition-all ${
//                           preferences.genre === genre
//                             ? 'bg-red-600 text-white border-2 border-red-500'
//                             : 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:border-gray-500'
//                         }`}
//                       >
//                         {genre}
//                       </button>
//                     ))}
//                   </div>
//                 </motion.div>
//               )}

//               {currentStep === 2 && (
//                 <motion.div
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   className="space-y-4"
//                 >
//                   <div className="flex items-center gap-2 mb-4">
//                     <Calendar className="text-red-500" size={20} />
//                     <h3 className="text-lg font-semibold text-white">When was it made?</h3>
//                   </div>
//                   <div className="space-y-3">
//                     {[
//                       { label: 'Latest & Greatest (2020-2024)', from: 2020, to: 2024 },
//                       { label: 'Modern Classics (2010-2019)', from: 2010, to: 2019 },
//                       { label: 'Golden Era (2000-2009)', from: 2000, to: 2009 },
//                       { label: 'Vintage Cinema (Before 2000)', from: 1900, to: 1999 },
//                       { label: 'Any Era', from: 1900, to: 2024 },
//                     ].map((option) => (
//                       <button
//                         key={option.label}
//                         onClick={() => handleYearRangeSelect(option.from, option.to)}
//                         className={`w-full p-4 rounded-lg text-left transition-all ${
//                           preferences.release_year_from === option.from
//                             ? 'bg-red-600 text-white border-2 border-red-500'
//                             : 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:border-gray-500'
//                         }`}
//                       >
//                         <div className="font-medium">{option.label}</div>
//                         <div className="text-sm opacity-75">
//                           {option.from === option.to ? option.from : `${option.from} - ${option.to}`}
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 </motion.div>
//               )}

//               {currentStep === 3 && (
//                 <motion.div
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   className="space-y-4"
//                 >
//                   <div className="flex items-center gap-2 mb-4">
//                     <Clock className="text-red-500" size={20} />
//                     <h3 className="text-lg font-semibold text-white">How much time do you have?</h3>
//                   </div>
//                   <div className="space-y-3">
//                     {[
//                       { label: 'Quick Watch (Under 90 min)', duration: 90 },
//                       { label: 'Standard Length (90-120 min)', duration: 120 },
//                       { label: 'Epic Experience (120-180 min)', duration: 180 },
//                       { label: 'Any Length', duration: 999 },
//                     ].map((option) => (
//                       <button
//                         key={option.label}
//                         onClick={() => handleDurationSelect(option.duration)}
//                         className={`w-full p-4 rounded-lg text-left transition-all ${
//                           preferences.duration_max === option.duration
//                             ? 'bg-red-600 text-white border-2 border-red-500'
//                             : 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:border-gray-500'
//                         }`}
//                       >
//                         <div className="font-medium">{option.label}</div>
//                         <div className="text-sm opacity-75">
//                           {option.duration === 999 ? 'No time limit' : `Up to ${option.duration} minutes`}
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 </motion.div>
//               )}

//               {currentStep === 4 && (
//                 <motion.div
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   className="space-y-4"
//                 >
//                   <div className="flex items-center gap-2 mb-4">
//                     <Shield className="text-red-500" size={20} />
//                     <h3 className="text-lg font-semibold text-white">Content preference?</h3>
//                   </div>
//                   <div className="space-y-3">
//                     <button
//                       onClick={() => handlePremiumSelect(true)}
//                       className={`w-full p-4 rounded-lg text-left transition-all ${
//                         preferences.include_premium === true
//                           ? 'bg-red-600 text-white border-2 border-red-500'
//                           : 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:border-gray-500'
//                       }`}
//                     >
//                       <div className="font-medium">Include Premium Content</div>
//                       <div className="text-sm opacity-75">
//                         Show me all movies (premium subscription may be required)
//                       </div>
//                     </button>
//                     <button
//                       onClick={() => handlePremiumSelect(false)}
//                       className={`w-full p-4 rounded-lg text-left transition-all ${
//                         preferences.include_premium === false
//                           ? 'bg-red-600 text-white border-2 border-red-500'
//                           : 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:border-gray-500'
//                       }`}
//                     >
//                       <div className="font-medium">Free Content Only</div>
//                       <div className="text-sm opacity-75">
//                         Show me only free movies I can watch right now
//                       </div>
//                     </button>
//                   </div>
//                 </motion.div>
//               )}
//             </div>

//             {/* Navigation Buttons */}
//             <div className="flex justify-between">
//               <button
//                 onClick={handlePrevious}
//                 disabled={currentStep === 1}
//                 className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                   currentStep === 1
//                     ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
//                     : 'bg-gray-700 text-white hover:bg-gray-600'
//                 }`}
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={handleNext}
//                 disabled={!isStepComplete()}
//                 className={`px-6 py-2 rounded-lg font-medium transition-all ${
//                   !isStepComplete()
//                     ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
//                     : currentStep === totalSteps
//                     ? 'bg-red-600 text-white hover:bg-red-700'
//                     : 'bg-red-600 text-white hover:bg-red-700'
//                 }`}
//               >
//                 {currentStep === totalSteps ? 'Get Recommendations' : 'Next'}
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default RecommendationQuiz;





import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Film, Clock, Calendar, Shield } from 'lucide-react';

interface RecommendationQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (preferences: RecommendationPreferences) => void;
}

interface RecommendationPreferences {
  genre?: string;
  release_year_from?: number;
  release_year_to?: number;
  duration_max?: number;
  include_premium?: boolean;
}

const RecommendationQuiz: React.FC<RecommendationQuizProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [preferences, setPreferences] = useState<RecommendationPreferences>({
    genre: '',
    release_year_from: undefined,
    release_year_to: undefined,
    duration_max: undefined,
    include_premium: true,
  });

  const totalSteps = 4;

  const genres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror','Romance', 'Sci-Fi', 
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit(preferences);
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setPreferences({
      genre: '',
      release_year_from: undefined,
      release_year_to: undefined,
      duration_max: undefined,
      include_premium: true,
    });
    onClose();
  };

  const handleGenreSelect = (genre: string) => {
    setPreferences({ ...preferences, genre });
  };

  const handleYearRangeSelect = (from: number, to: number) => {
    setPreferences({ 
      ...preferences, 
      release_year_from: from, 
      release_year_to: to 
    });
  };

  const handleDurationSelect = (maxDuration: number) => {
    setPreferences({ ...preferences, duration_max: maxDuration });
  };

  const handlePremiumSelect = (includePremium: boolean) => {
    setPreferences({ ...preferences, include_premium: includePremium });
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1: return preferences.genre !== '';
      case 2: return preferences.release_year_from !== undefined && preferences.release_year_to !== undefined;
      case 3: return preferences.duration_max !== undefined;
      case 4: return preferences.include_premium !== undefined;
      default: return false;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 backdrop-blur-xs bg-gradient-to-br from-black via-zinc-900"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="relative backdrop-blur-sm bg-gradient-to-br from-black via-zinc-900 rounded-xl p-6 w-full max-w-md mx-4 border border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="text-red-500" size={24} />
                <h2 className="text-xl font-bold text-white">Find Your Perfect Movie</h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-red-500 h-2 rounded-full"
                  initial={{ width: '25%' }}
                  animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Question Content */}
            <div className="mb-6 min-h-[250px]">
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Film className="text-red-500" size={20} />
                    <h3 className="text-lg font-semibold text-white">What genre suits your mood?</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {genres.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => handleGenreSelect(genre)}
                        className={`p-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                          preferences.genre === genre
                            ? 'bg-red-600 text-white border-2 border-red-500'
                            : 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:border-gray-500'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="text-red-500" size={20} />
                    <h3 className="text-lg font-semibold text-white">When was it made?</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Latest & Greatest (2020-2024)', from: 2020, to: 2024 },
                      { label: 'Modern Classics (2010-2019)', from: 2010, to: 2019 },
                      { label: 'Golden Era (2000-2009)', from: 2000, to: 2009 },
                      { label: 'Vintage Cinema (Before 2000)', from: 1900, to: 1999 },
                      { label: 'Any Era', from: 1900, to: 2024 },
                    ].map((option) => (
                      <button
                        key={option.label}
                        onClick={() => handleYearRangeSelect(option.from, option.to)}
                        className={`w-full p-4 rounded-lg text-left transition-all cursor-pointer ${
                          preferences.release_year_from === option.from && preferences.release_year_to === option.to
                            ? 'bg-red-600 text-white border-2 border-red-500'
                            : 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:border-gray-500'
                        }`}
                      >
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm opacity-75">
                          {option.from === option.to ? option.from : `${option.from} - ${option.to}`}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="text-red-500" size={20} />
                    <h3 className="text-lg font-semibold text-white">How much time do you have?</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Quick Watch (Under 90 min)', duration: 90 },
                      { label: 'Standard Length (90-120 min)', duration: 120 },
                      { label: 'Epic Experience (120-180 min)', duration: 180 },
                      { label: 'Any Length', duration: 999 },
                    ].map((option) => (
                      <button
                        key={option.label}
                        onClick={() => handleDurationSelect(option.duration)}
                        className={`w-full p-4 rounded-lg text-left transition-all cursor-pointer ${
                          preferences.duration_max === option.duration
                            ? 'bg-red-600 text-white border-2 border-red-500'
                            : 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:border-gray-500'
                        }`}
                      >
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm opacity-75">
                          {option.duration === 999 ? 'No time limit' : `Up to ${option.duration} minutes`}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="text-red-500" size={20} />
                    <h3 className="text-lg font-semibold text-white">Content preference?</h3>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => handlePremiumSelect(true)}
                      className={`w-full p-4 rounded-lg text-left transition-all cursor-pointer ${
                        preferences.include_premium === true
                          ? 'bg-red-600 text-white border-2 border-red-500'
                          : 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-medium">Include Premium Content</div>
                      <div className="text-sm opacity-75">
                        Show me all movies (premium subscription may be required)
                      </div>
                    </button>
                    <button
                      onClick={() => handlePremiumSelect(false)}
                      className={`w-full p-4 rounded-lg text-left transition-all cursor-pointer ${
                        preferences.include_premium === false
                          ? 'bg-red-600 text-white border-2 border-red-500'
                          : 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-medium">Free Content Only</div>
                      <div className="text-sm opacity-75">
                        Show me only free movies I can watch right now
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentStep === 1
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 text-white cursor-pointer hover:bg-gray-600'
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={!isStepComplete()}
                className={`px-6 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                  !isStepComplete()
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed '
                    : currentStep === totalSteps
                    ? 'bg-red-600 text-white hover:bg-red-700 '
                    : 'bg-red-600 text-white hover:bg-red-700 ' 
                }`}
              >
                {currentStep === totalSteps ? 'Get Recommendations' : 'Next'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RecommendationQuiz;