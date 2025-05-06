import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const Notification = ({ message, type, onClose }) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${
                    type === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}
            >
                <div className="flex-shrink-0">
                    {type === 'success' ? (
                        <CheckCircleIcon className="h-6 w-6 text-white" />
                    ) : (
                        <XCircleIcon className="h-6 w-6 text-white" />
                    )}
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-white">{message}</p>
                </div>
                <div className="ml-auto pl-3">
                    <div className="-mx-1.5 -my-1.5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex rounded-md p-1.5 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                        >
                            <span className="sr-only">Dismiss</span>
                            <svg
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Notification;