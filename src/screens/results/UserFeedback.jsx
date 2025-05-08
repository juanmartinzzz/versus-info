import { useState } from "react";
import { motion } from "framer-motion";
import { internationalization } from "../../internationalization/internationalization";
import supabase from "../../integrations/supabase";

const initialValues = {
  comment: '',
  contactInfo: '',
  improvementSuggestion: '',
}

const UserFeedback = () => {
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(initialValues);
  const translated = internationalization.getTranslated();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate at least one field has content
    if (!formData.comment && !formData.improvementSuggestion) {
      setError('Please fill in at least one field before submitting.');
      return;
    }

    // Send feedback to supabase
    supabase.comment.upsert({comment: {improvementSuggestion: formData.improvementSuggestion, contactInfo: formData.contactInfo}});

    // Set submitted state to true to show thank you message
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div>
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>

          <h2 className="mt-3 text-xl font-semibold text-accent1">{translated.thanksForWriting}</h2>
          <p className="mt-2 text-secondary">{translated.yourInputIsWhatHelpsUsImprove}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-accent3">{translated.shareYourFeedback}</h2>

      {/* <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          Comments or Questions (Optional)
        </label>

        <textarea
          id="comment"
          name="comment"
          rows="3"
          className="w-full px-3 py-2 text-secondary border"
          value={formData.comment}
          onChange={handleChange}
          placeholder="Share your thoughts with us..."
        ></textarea>
      </div> */}

      <div className="mb-4">
        <label htmlFor="improvementSuggestion" className="block text-sm font-medium text-gray-700 mb-1">
          {translated.whatCouldWeDoToMakeYourExperienceBetter}
        </label>

        <textarea
          id="improvementSuggestion"
          name="improvementSuggestion"
          rows="1"
          className="w-full px-3 py-2 text-secondary border field-sizing-content"
          value={formData.improvementSuggestion}
          onChange={handleChange}
          placeholder={translated.weWouldLoveToHearYourSuggestions}
        ></textarea>
      </div>

      <div className="mb-4">
        <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-1">
          {translated.howCanWeContactYouOptional}
        </label>

        <input
          type="text"
          id="contactInfo"
          name="contactInfo"
          className="w-full px-3 py-2 text-secondary border"
          value={formData.contactInfo}
          onChange={handleChange}
          placeholder={translated.emailPhoneOrSocialMediaHandle}
        />
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}


      <motion.button
        onClick={handleSubmit}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-2 px-6 flex items-center justify-center gap-2 text-white bg-accent3 rounded-md"
      >
        {translated.sendFeedback}
      </motion.button>
    </div>
  );
};

export default UserFeedback;