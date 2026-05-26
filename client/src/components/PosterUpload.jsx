import { useEffect, useRef, useState } from 'react';
import { Loader2, Upload, X } from 'lucide-react';
import { ACCEPTED_POSTER_TYPES, validatePosterFile } from '../utils/image';

const PosterUpload = ({ file, previewUrl, onFileChange, onClear, disabled = false }) => {
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleFile = (selected) => {
    setError('');
    const validation = validatePosterFile(selected);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    if (selected) {
      objectUrlRef.current = URL.createObjectURL(selected);
      onFileChange(selected, objectUrlRef.current);
    }
  };

  const handleInputChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  const handleClear = () => {
    setError('');
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (inputRef.current) inputRef.current.value = '';
    onClear();
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Event poster ({ACCEPTED_POSTER_TYPES.label}, max 5MB)
      </label>

      <input
        ref={inputRef}
        type="file"
        name="image"
        accept={ACCEPTED_POSTER_TYPES.accept}
        disabled={disabled}
        onChange={handleInputChange}
        className="hidden"
        id="poster-upload"
      />

      {!previewUrl ? (
        <label
          htmlFor="poster-upload"
          className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            disabled
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : 'border-purple-300 bg-purple-50/50 hover:bg-purple-50 hover:border-purple-400'
          }`}
        >
          {disabled ? (
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-2" />
          ) : (
            <Upload className="w-8 h-8 text-purple-500 mb-2" />
          )}
          <span className="text-sm text-gray-600 font-medium">
            {disabled ? 'Uploading to Cloudinary...' : 'Click to upload poster'}
          </span>
          <span className="text-xs text-gray-400 mt-1">{ACCEPTED_POSTER_TYPES.label}</span>
        </label>
      ) : (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="Poster preview"
            className="w-full max-w-xs h-48 object-cover rounded-xl border shadow-md"
          />
          {!disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
              aria-label="Remove poster"
            >
              <X size={16} />
            </button>
          )}
          {disabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default PosterUpload;
