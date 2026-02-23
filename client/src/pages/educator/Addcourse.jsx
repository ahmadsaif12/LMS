import React, { useEffect, useRef, useState, useContext } from 'react'
import { assets } from '../../assets/assets'
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { AppContext } from '../../context/Appcontext'

const AddCourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const { currency } = useContext(AppContext);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  });

  // --- Chapter Functions ---
  const handleAddChapter = () => {
    const newChapter = {
      chapterId: Date.now(),
      chapterTitle: '',
      chapterContent: [],
      collapsed: false,
    };
    setChapters([...chapters, newChapter]);
  };

  const handleRemoveChapter = (id) => {
    setChapters(chapters.filter(chapter => chapter.chapterId !== id));
  };

  const toggleChapter = (id) => {
    setChapters(chapters.map(chapter => 
      chapter.chapterId === id ? { ...chapter, collapsed: !chapter.collapsed } : chapter
    ));
  };

  const handleChapterNameChange = (id, name) => {
    setChapters(chapters.map(c => c.chapterId === id ? { ...c, chapterTitle: name } : c));
  };

  // --- Lecture Functions ---
  const handleAddLecture = (chapterId) => {
    setCurrentChapterId(chapterId);
    setShowPopup(true);
  };

  const confirmAddLecture = () => {
    setChapters(chapters.map(chapter => {
      if (chapter.chapterId === currentChapterId) {
        return { ...chapter, chapterContent: [...chapter.chapterContent, lectureDetails] };
      }
      return chapter;
    }));
    setShowPopup(false);
    setLectureDetails({ lectureTitle: '', lectureDuration: '', lectureUrl: '', isPreviewFree: false });
  };

  const handleRemoveLecture = (chapterId, lectureIndex) => {
    setChapters(chapters.map(chapter => {
      if (chapter.chapterId === chapterId) {
        const updatedContent = chapter.chapterContent.filter((_, index) => index !== lectureIndex);
        return { ...chapter, chapterContent: updatedContent };
      }
      return chapter;
    }));
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' });
    }
  }, []);

  return (
    <div className='h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0 bg-[#fbfbfb]'>
      <form className='flex flex-col gap-6 max-w-4xl w-full text-gray-500 pb-10' onSubmit={(e)=>e.preventDefault()}>
        
        {/* --- Header Section --- */}
        <div className='flex justify-between items-center w-full'>
            <h1 className='text-2xl font-bold text-gray-900'>Create New Course</h1>
            <button type="submit" className='bg-black text-white py-2.5 px-10 rounded-lg font-semibold hover:bg-gray-800 transition-all shadow-md active:scale-95'>
              Publish Course
            </button>
        </div>

        {/* --- Main Info Section --- */}
        <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <p className='text-sm font-semibold text-gray-700'>Course Title</p>
              <input onChange={e => setCourseTitle(e.target.value)} value={courseTitle} 
              type="text" placeholder='Ex: Fullstack Web Development' className='outline-none border border-gray-200 px-4 py-3 rounded-lg focus:border-black transition-colors' required />
            </div>

            <div className='flex flex-col gap-2'>
              <p className='text-sm font-semibold text-gray-700'>Course Description</p>
              <div ref={editorRef} className='bg-white border-gray-200 rounded-b-lg'></div>
            </div>
        </div>

        {/* --- Pricing & Thumbnail --- */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2'>
            <p className='text-sm font-semibold text-gray-700'>Price ({currency})</p>
            <input onChange={e => setCoursePrice(e.target.value)} value={coursePrice} 
            type="number" placeholder='0' className='outline-none border border-gray-200 px-4 py-2 rounded-lg focus:border-black' required />
          </div>

          <div className='bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2'>
            <p className='text-sm font-semibold text-gray-700'>Discount %</p>
            <input onChange={e => setDiscount(e.target.value)} value={discount} 
            type="number" placeholder='0' className='outline-none border border-gray-200 px-4 py-2 rounded-lg focus:border-black' required />
          </div>

          <div className='bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2'>
            <p className='text-sm font-semibold text-gray-700'>Thumbnail</p>
            <label htmlFor='thumbnail' className='cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg py-1.5 hover:bg-gray-50 transition-colors'>
                <div className='flex items-center gap-2'>
                    <img src={image ? URL.createObjectURL(image) : assets.file_upload_icon} className={image ? 'w-10 h-8 object-cover rounded' : 'w-4'} alt="" />
                    <span className='text-xs font-medium'>{image ? 'Change Image' : 'Click to upload'}</span>
                </div>
                <input type="file" id='thumbnail' onChange={e => setImage(e.target.files[0])} accept="image/*" hidden />
            </label>
          </div>
        </div>

        {/* --- CURRICULUM UI --- */}
        <div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-lg font-bold text-gray-900'>Course Curriculum</h2>
            <span className='text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-full'>{chapters.length} Chapters</span>
          </div>
          
          <div className='space-y-4'>
            {chapters.map((chapter, index) => (
              <div key={chapter.chapterId} className='border border-gray-100 rounded-xl bg-[#fcfcfc] overflow-hidden'>
                <div className='p-4 flex items-center justify-between gap-4 bg-gray-50/50'>
                  <div className='flex items-center gap-3 flex-1'>
                    <img 
                      src={assets.dropdown_icon} 
                      className={`w-3 cursor-pointer transition-transform ${chapter.collapsed ? '-rotate-90' : ''}`} 
                      onClick={() => toggleChapter(chapter.chapterId)}
                      alt="" 
                    />
                    <span className='text-sm font-bold text-gray-400'>#{index + 1}</span>
                    <input 
                      type="text" 
                      placeholder='Chapter Name' 
                      className='bg-transparent outline-none font-semibold text-gray-800 w-full placeholder:text-gray-300'
                      value={chapter.chapterTitle}
                      onChange={(e) => handleChapterNameChange(chapter.chapterId, e.target.value)}
                    />
                  </div>
                  <div className='flex items-center gap-4'>
                    <p className='text-xs text-gray-500'>{chapter.chapterContent.length} Lectures</p>
                    <button type="button" onClick={() => handleAddLecture(chapter.chapterId)} className='text-blue-600 text-xs font-bold hover:underline'>
                      + Add Lecture
                    </button>
                    <img 
                      src={assets.cross_icon} 
                      className='w-3 cursor-pointer opacity-50 hover:opacity-100' 
                      onClick={() => handleRemoveChapter(chapter.chapterId)}
                      alt="" 
                    />
                  </div>
                </div>

                {/* Lecture List */}
                {!chapter.collapsed && (
                  <div className='p-3 space-y-2'>
                    {chapter.chapterContent.map((lecture, lIdx) => (
                      <div key={lIdx} className='flex items-center justify-between bg-white p-3 border border-gray-100 rounded-lg shadow-sm group'>
                        <div className='flex items-center gap-3'>
                          <div className='w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center'>
                               <img src={assets.play_icon} className='w-2' alt="" />
                          </div>
                          <span className='text-gray-700 text-sm font-medium'>{lIdx + 1}. {lecture.lectureTitle}</span>
                        </div>
                        <div className='flex items-center gap-3'>
                          <span className='text-gray-400 text-[11px] bg-gray-50 px-2 py-0.5 rounded'>{lecture.lectureDuration} mins</span>
                          <img 
                            src={assets.cross_icon} 
                            className='w-2.5 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity' 
                            onClick={() => handleRemoveLecture(chapter.chapterId, lIdx)}
                            alt="" 
                          />
                        </div>
                      </div>
                    ))}
                    {chapter.chapterContent.length === 0 && (
                      <p className='text-center text-xs text-gray-400 py-2'>No lectures added yet.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button 
            type='button'
            onClick={handleAddChapter}
            className='mt-6 w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold text-sm hover:text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center gap-2'
          >
            <span className='text-xl'>+</span> New Chapter
          </button>
        </div>
      </form>

      {/* --- POPUP MODAL --- */}
      {showPopup && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-white p-8 rounded-2xl w-full max-w-[420px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative'>
            <h2 className='text-xl font-bold text-gray-900 mb-2'>Add Lecture</h2>
            <div className='space-y-4 mt-6'>
              <div className='flex flex-col gap-1.5'>
                <p className='text-xs font-bold text-gray-500 uppercase'>Lecture Title</p>
                <input type="text" className='w-full border-gray-200 border p-3 rounded-xl outline-none focus:border-black' placeholder='Ex: Intro to JSX' onChange={(e) => setLectureDetails({...lectureDetails, lectureTitle: e.target.value})}/>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='flex flex-col gap-1.5'>
                  <p className='text-xs font-bold text-gray-500 uppercase'>Duration (Min)</p>
                  <input type="number" className='w-full border-gray-200 border p-3 rounded-xl outline-none focus:border-black' onChange={(e) => setLectureDetails({...lectureDetails, lectureDuration: e.target.value})}/>
                </div>
                <div className='flex items-center gap-3 pt-6 px-2'>
                    <input type="checkbox" id='preview' className='w-4 h-4 rounded border-gray-300 accent-black' onChange={(e) => setLectureDetails({...lectureDetails, isPreviewFree: e.target.checked})}/>
                    <label htmlFor="preview" className='text-xs font-bold text-gray-600 cursor-pointer'>FREE PREVIEW</label>
                </div>
              </div>
              <div className='flex flex-col gap-1.5'>
                <p className='text-xs font-bold text-gray-500 uppercase'>Video URL</p>
                <input type="text" className='w-full border-gray-200 border p-3 rounded-xl outline-none focus:border-black' placeholder='https://youtube.com/...' onChange={(e) => setLectureDetails({...lectureDetails, lectureUrl: e.target.value})}/>
              </div>
            </div>
            <button onClick={confirmAddLecture} className='w-full bg-black text-white py-4 rounded-xl mt-8 font-bold hover:bg-gray-800 shadow-lg active:scale-95 transition-all'>Confirm & Add</button>
            <button onClick={() => setShowPopup(false)} className='absolute top-6 right-6 text-gray-400 hover:text-black'>
                <img src={assets.cross_icon} className='w-3' alt="" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddCourse;