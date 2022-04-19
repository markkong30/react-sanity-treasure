import React, { useState, useRef } from 'react';
import Select from 'react-select';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { categories } from '../utils/categories';
import { client } from '../client';
import Spinner from './Spinner';
import { useEffect } from 'react';

const getOptions = () => {
  let options = [];
  function capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
  }

  for (const ele of categories) {
    const newOption = [{ value: ele.name, label: capitalize(ele.name) }]
    options = [...options, ...newOption];

  }
  return options;
}



const CreatePin = ({ user }) => {
  const [formData, setFormData] = useState({
    title: '',
    about: '',
    destination: '',
    fields: false,
  });
  const { title, about, destination, fields } = formData;
  const [category, setCategory] = useState(null)
  const [imageAsset, setImageAsset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [enableSubmit, setEnableSubmit] = useState(false)
  const navigate = useNavigate();
  const form = useRef();

  useEffect(() => {
    const inputs = [...form.current.querySelectorAll('.input')];

    for (const input of inputs) {
      if (input.value.length == 0 || imageAsset == null || category == null) {
        return setEnableSubmit(false);
      }
    }
    return setEnableSubmit(true);

  }, [formData, category, imageAsset])

  const uploadImage = e => {
    setLoading(true);

    const file = e.target.files[0];
    client.assets
      .upload('image', file, { contentType: file.type, filename: e.target.name })
      .then(doc => {
        setImageAsset(doc);
        setLoading(false);
      })
      .catch(err => {
        console.log(err)
      })
  }

  const updateForm = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, ...{ [name]: value } });

  }

  const savePin = () => {
    const doc = {
      _type: 'pin',
      title,
      about,
      destination,
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAsset?._id
        }
      },
      userID: user._id,
      postedBy: {
        _type: 'postedBy',
        _ref: user._id,
      },
      category: category.value,
    }

    client.create(doc)
      .then(() => {
        navigate('/')
      })
  }


  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {fields && (
        <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>Please fill in all the fields</p>
      )}
      <div className="flex flex-col lg:flex-row justify-center items-center bg-white p-3 lg:p-5 w-full lg:w-4/5">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {loading && <Spinner />}
            {!imageAsset ?
              <label className='cursor-copy'>
                <div className="flex flex-col items-center justify-center  h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to upload</p>
                  </div>
                  <p className="mt-32 text-gray-400">
                    Supported file: JPG, SVG, PNG, GIF
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  name="upload-image"
                  onChange={uploadImage}
                  className='w-0 h-0 image' />
              </label>
              :
              <div className="relative h-full">
                <img src={imageAsset?.url} className='h-full w-full' alt="" />
                <button
                  className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none shadow-md hover:shadow-lg transition-all duration-500 ease-in-out'
                  onClick={() => {
                    setImageAsset(null);
                  }}>
                  <MdDelete />
                </button>
              </div>
            }
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-6 mt-5 w-full lg:pl-5" ref={form}>
          <input type="text" name="title" value={title}
            placeholder='Add your title here'
            onChange={updateForm}
            className='outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2 input' />
          {user && (
            <div className="flex gap-2 mt-2 mb-2 items-center bg-white rounded-lg ">
              <img
                src={user.image}
                className="w-10 h-10 rounded-full"
                alt="user-profile"
              />
              <p className="font-bold">{user.username}</p>
            </div>
          )}
          <input
            type="text"
            name="about"
            value={about}
            onChange={updateForm}
            placeholder="What is your pin about"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2 input"
          />
          <input
            type="url"
            name="destination"
            value={destination}
            onChange={updateForm}
            placeholder="Add a destination link"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2 input"
          />

          <div className="flex flex-col">
            <div>
              <p className='mb-2 font-semibold text-lg text-slate-700'>Choose Pin Category</p>
              <Select
                value={category}
                name="category"
                isSearchable
                isClearable
                onChange={(selected) => {
                  setCategory(selected);
                }}
                options={getOptions()}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 10,
                  colors: {
                    ...theme.colors,
                    primary25: '#FF8A80',
                    primary50: '#FF8A80',
                    primary: '#EF5350',
                  },
                })}
              />
            </div>
            <div className="flex justify-end items-end mt-6">
              {enableSubmit ?
                <button
                  type="button"
                  onClick={savePin}
                  className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
                >
                  Post
                </button>
                :
                <button className="bg-red-300 text-white font-bold p-2 rounded-full w-28 outline-none cursor-not-allowed">
                  Post
                </button>
              }

            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CreatePin;