import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

/**
 * Global hook for handling messaging functionality across the app
 *
 * IMPORTANT: Chats are based on user-to-user relationships, NOT property-specific.
 * This means there is only ONE chat between any two users, regardless of how many properties they message about.
 *
 * Usage Examples:
 *
 * For booking-related messaging (host bookings page, guest booking details):
 * const { messageAboutBooking, isMessagingTarget } = useMessaging();
 * await messageAboutBooking(receiverId, bookingObject);
 * if (isMessagingTarget(bookingId)) - show loading state
 *
 * For property-related messaging (property detail page):
 * const { messageAboutProperty, isMessaging } = useMessaging();
 * await messageAboutProperty(receiverId, propertyObject);
 * if (isMessaging) - show loading state
 *
 * For general user messaging:
 * const { messageUser } = useMessaging();
 * await messageUser(receiverId);
 *
 * For custom messaging with full control:
 * const { sendMessage } = useMessaging();
 * await sendMessage(receiverId, fallbackData, targetId);
 *
 * @param {Object} options - Configuration options
 * @param {boolean} options.showToast - Whether to show toast notifications (default: true)
 * @returns {Object} - Hook functions and state
 */
export const useMessaging = (options = {}) => {
  const { showToast = true } = options;
  const navigate = useNavigate();
  const [isMessaging, setIsMessaging] = useState(false);
  const [messagingTarget, setMessagingTarget] = useState(null);

  /**
   * Send a message to a user
   * Based only on user-to-user relationship, not property-specific
   * @param {string} receiverId - ID of the user to message
   * @param {Object} fallbackData - Fallback data for navigation if API fails
   * @param {string} targetId - ID to track which item is being messaged (optional)
   */
  const sendMessage = async (
    receiverId,
    fallbackData = {},
    targetId = null,
  ) => {
    if (!receiverId) {
      if (showToast) toast.error("Invalid recipient");
      return;
    }

    setIsMessaging(true);
    setMessagingTarget(targetId);
    try {
      const { data } = await axios.post("/chats", {
        receiverId,
      });

      if (showToast) toast.success("Chat opened successfully");
      navigate("/messages", { state: { chatId: data._id } });
    } catch (error) {
      console.error("Error creating/finding chat:", error);

      if (showToast) {
        toast.error(error?.response?.data?.message || "Failed to open chat");
      }

      // Fallback navigation with provided data
      navigate("/messages", {
        state: fallbackData,
      });
    } finally {
      setIsMessaging(false);
      setMessagingTarget(null);
    }
  };

  /**
   * Send a message to a user about a booking
   * @param {string} receiverId - ID of the user to message
   * @param {Object} booking - Booking object containing guest info
   */
  const messageAboutBooking = async (receiverId, booking) => {
    const fallbackData = {
      guestName: booking?.guest,
      propertyName: booking?.property,
      bookingId: booking?.id,
    };

    await sendMessage(receiverId, fallbackData, booking?.id);
  };

  /**
   * Send a message to a user about a property
   * @param {string} receiverId - ID of the user to message
   * @param {Object} property - Property object
   */
  const messageAboutProperty = async (receiverId, property) => {
    const fallbackData = {
      propertyName: property?.title,
      propertyId: property?._id,
    };

    await sendMessage(receiverId, fallbackData, property?._id);
  };

  /**
   * Send a general message to a user
   * @param {string} receiverId - ID of the user to message
   */
  const messageUser = async (receiverId) => {
    await sendMessage(receiverId, {});
  };

  /**
   * Check if a specific target is currently being messaged
   * @param {string} targetId - ID of the target to check
   * @returns {boolean} - Whether the target is being messaged
   */
  const isMessagingTarget = (targetId) => {
    return isMessaging && messagingTarget === targetId;
  };

  return {
    sendMessage,
    messageAboutBooking,
    messageAboutProperty,
    messageUser,
    isMessaging,
    messagingTarget,
    isMessagingTarget,
  };
};
