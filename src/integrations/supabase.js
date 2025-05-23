import time from '../utils/time';
import { constants } from '../data/constants';
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single supabase client for interacting with your database
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Transform keys of an object to lowercase and replace spaces with underscores
 * @param {Object} data - The object to transform
 * @returns {Object} - The transformed object
 */
const transformKeysToUnderscores = ({data}) => {
  if(!data) {
    return;
  };

  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key.replace(/([A-Z])/g, '_$1').toLowerCase(),
      value
    ])
  );
}

/**
 * Transform keys of an object to camel case
 * @param {Object} data - The object to transform
 * @returns {Object} - The transformed object
 */
const transformKeysToCamelCase = ({data}) => {
  if(!data) {
    return;
  };

  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
      value
    ])
  );
}

/**
 * Get the user's IP address and geolocation information
 * @returns {Promise<Object>} - Object containing IP and geo data
 */
const getIpAndGeoData = async () => {
  try {
    // Get IP address using a public API
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const ip = ipData.ip;

    // Get geolocation data using IP
    const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
    const geoData = await geoResponse.json();

    // Get browser information
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return {
      ipAddress: ip,
      geoCountry: geoData.country_name,
      geoRegion: geoData.region,
      geoCity: geoData.city,
      geoLatitude: geoData.latitude,
      geoLongitude: geoData.longitude,
      geoTimezone: timeZone,
      browserInfo: userAgent,
      geoLanguage: language
    };
  } catch (error) {
    console.error('Error getting IP/Geo data:', error);
    return {};
  }
};

/**
 * @param {Object} questions - The questions object to save
 * @returns {Promise} - The result of the upsert operation
 */
const upsertQuestion = async ({question}) => {
  try {
    const { data, error } = await supabaseClient
      .from('questions')
      .upsert(transformKeysToUnderscores({data: question}), {
        onConflict: 'relevant_date',
        returning: 'minimal' // Only return the minimal data needed
      });

    if (error) throw error;

    return transformKeysToCamelCase({data});
  } catch (error) {
    console.error('Error upserting questions:', error);
    return { data: null, error };
  }
};

/**
 * @param {Object} answers - The answers object to save
 * @returns {Promise} - The result of the upsert operation
 */
const upsertAnswer = async ({answer}) => {
  try {
    // Get IP and geo data
    const ipGeoData = await getIpAndGeoData();
    const localId = localStorage.getItem(constants.localStorageKeys.localId);

    // Prepare the plan data with IP and geo information
    const enrichedData = {
      ...transformKeysToUnderscores({data: answer}),
      ...transformKeysToUnderscores({data: ipGeoData}),
      local_id: localId,
    };

    const { data, error } = await supabaseClient
      .from('answers')
      .upsert(enrichedData, {
        onConflict: ['local_id', 'relevant_date'],
        returning: 'minimal' // Only return the minimal data needed
      });

    if (error) throw error;

    return transformKeysToCamelCase({data});
  } catch (error) {
    console.error('Error upserting answers:', error);
    return { data: null, error };
  }
}


/**
 * @param {string} id - The ID of the question to delete
 * @returns {Promise} - The result of the delete operation
 */
const deleteQuestions = async ({id}) => {
  try {
    const { data, error } = await supabaseClient
      .from('questions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error deleting questions:', error);
    return { data: null, error };
  }
};

/**
 * @returns {Promise} - The result of the fetch operation
 */
const getRelevantQuestion = async () => {
  try {
    const { data, error } = await supabaseClient
      .from('questions')
      .select('*')
      .eq('relevant_date', time.getDateWithoutTimeString())
      .limit(1);

    if(error) throw error;

    if(data.length === 0) {
      throw new Error('No question found');
    }

    const question = data[0];
    return transformKeysToCamelCase({data: question});
  } catch (error) {
    console.error('Error fetching relevant question:', error);
    return { data: null, error };
  }
};

/**
 * @param {string} userId - The ID of the user
 * @returns {Promise} - The result of the fetch operation
 */
const getRelevantQuestionByDate = async ({date}) => {
  try {
    const { data, error } = await supabaseClient
      .from('questions')
      .select('*')
      .eq('relevant_date', date)
      .limit(1);

    if (error) throw error;

    const question = data[0];
    return transformKeysToCamelCase({data: question});
  } catch (error) {
    console.error('Error fetching relevant question:', error);
    return { data: null, error };
  }
};

/**
 * @param {string} id - The ID of the plan to fetch
 * @returns {Promise} - The result of the fetch operation
 */
const getQuestionById = async ({id}) => {
  try {
    const { data, error } = await supabaseClient
      .from('questions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { data: transformKeysToCamelCase({data}), error: null };
  } catch (error) {
    console.error('Error fetching question:', error);
    return { data: null, error };
  }
};

const supabase = {
  /**
   * @param {Object} answers - The answers object to save
   * @returns {Promise} - The result of the upsert operation
   */
  upsertAnswer: async ({answer}) => {
    try {
      // Get IP and geo data
      const ipGeoData = await getIpAndGeoData();
      const localId = localStorage.getItem(constants.localStorageKeys.localId);

      // Prepare the plan data with IP and geo information
      const enrichedData = {
        ...transformKeysToUnderscores({data: answer}),
        ...transformKeysToUnderscores({data: ipGeoData}),
        local_id: localId,
      };

      const { data, error } = await supabaseClient
        .from('answers')
        .upsert(enrichedData, {
          onConflict: ['local_id', 'relevant_date'],
          returning: 'minimal' // Only return the minimal data needed
        });

      if (error) throw error;

      return transformKeysToCamelCase({data});
    } catch (error) {
      console.error('Error upserting answers:', error);
      return { data: null, error };
    }
  },
  /**
   * @param {Object} questions - The questions object to save
   * @returns {Promise} - The result of the upsert operation
   */
  upsertQuestion: async ({question}) => {
    try {
      const { data, error } = await supabaseClient
        .from('questions')
        .upsert(transformKeysToUnderscores({data: question}), {
          onConflict: 'relevant_date',
          returning: 'minimal' // Only return the minimal data needed
        });

      if (error) throw error;

      return transformKeysToCamelCase({data});
    } catch (error) {
      console.error('Error upserting questions:', error);
      return { data: null, error };
    }
  },
  /**
   * @param {string} id - The ID of the question to delete
   * @returns {Promise} - The result of the delete operation
   */
  deleteQuestions: async ({id}) => {
    try {
      const { data, error } = await supabaseClient
        .from('questions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error deleting questions:', error);
      return { data: null, error };
    }
  },
  /**
   * @param {string} id - The ID of the question to fetch
   * @returns {Promise} - The result of the fetch operation
   */
  getQuestionById: async ({id}) => {
    try {
      const { data, error } = await supabaseClient
        .from('questions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data: transformKeysToCamelCase({data}), error: null };
    } catch (error) {
      console.error('Error fetching question:', error);
      return { data: null, error };
    }
  },
  /**
   * @returns {Promise} - The result of the fetch operation
   */
  getRelevantQuestion: async () => {
    try {
      const { data, error } = await supabaseClient
        .from('questions')
        .select('*')
        .eq('relevant_date', time.getDateWithoutTimeString())
        .limit(1);

      if(error) throw error;

      if(data.length === 0) {
        throw new Error('No question found');
      }

      const question = data[0];
      return transformKeysToCamelCase({data: question});
    } catch (error) {
      console.error('Error fetching relevant question:', error);
      return { data: null, error };
    }
  },
  /**
   * @param {string} date - The date of the question to fetch
   * @returns {Promise} - The result of the fetch operation
   */
  getRelevantQuestionByDate: async ({date}) => {
    try {
      const { data, error } = await supabaseClient
        .from('questions')
        .select('*')
        .eq('relevant_date', date)
        .limit(1);

      if (error) throw error;

      const question = data[0];
      return transformKeysToCamelCase({data: question});
    } catch (error) {
      console.error('Error fetching relevant question:', error);
      return { data: null, error };
    }
  },
  comment: {
    /**
     * @param {Object} comment - The comment object to save
     * @returns {Promise} - The result of the upsert operation
     */
    upsert: async ({comment}) => {
      try {
        // Get IP and geo data
        const ipGeoData = await getIpAndGeoData();
        const localId = localStorage.getItem(constants.localStorageKeys.localId);

        // Enrich data
        const enrichedData = {
          ...transformKeysToUnderscores({data: comment}),
          ...transformKeysToUnderscores({data: ipGeoData}),
          local_id: localId,
          relevant_date: time.getDateWithoutTimeString(),
        };

        const { data, error } = await supabaseClient
          .from('comments')
          .upsert(enrichedData, {
            onConflict: ['id'],
            returning: 'minimal' // Only return the minimal data needed
          });

        if (error) throw error;

        return transformKeysToCamelCase({data});
      } catch (error) {
        console.error('Error upserting comments:', error);
        return { data: null, error };
      }
    }
  },
}

export default supabase;