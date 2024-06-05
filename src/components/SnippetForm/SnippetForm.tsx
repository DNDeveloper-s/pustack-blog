"use client";

import { Post } from "@/firebase/post";
import BlogWithAuthor, { BlogWithAuthorV2 } from "../Blogs/BlogWithAuthor";
import BlueCircleBlog from "../Blogs/BlueCircleBlog";
import Dashboard from "../Dashboard/Dashboard";
import { useState } from "react";
import { GoCheckCircleFill } from "react-icons/go";
import Image from "next/image";
import { avatar, imageOne } from "@/assets";
import { TbCaretDownFilled } from "react-icons/tb";

function SnippetPositionControl<T = string>({
  children,
  handleChange,
  value,
  isSelected,
  containerStyle,
  iconStyle,
}: {
  children: React.ReactNode;
  handleChange?: (value: T | null) => void;
  value?: T;
  isSelected?: boolean;
  containerStyle?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
}) {
  return (
    <div
      className={
        "group/snippet-control relative border border-dashed border-tertiary border-opacity-30 hover:border-opacity-100 rounded transition-all bg-gray-500 bg-opacity-5 hover:bg-opacity-20 px-3 py-3 " +
        (isSelected
          ? "!border-opacity-100 !bg-opacity-20"
          : "border-opacity-30 bg-opacity-5")
      }
      onClick={() => {
        value && handleChange?.(isSelected ? null : value);
      }}
      style={containerStyle}
    >
      {children}
      {isSelected && (
        <div
          style={iconStyle}
          className="absolute bottom-full left-full transform -translate-x-1/2 translate-y-1/2 text-[14px]"
        >
          <GoCheckCircleFill className="text-[36px] text-appBlue" />
        </div>
      )}
    </div>
  );
}

export default function SnippetForm({ post }: { post?: Post | null }) {
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [selectedSnippet, setSelectedSnippet] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<
    "design" | "position" | null
  >("design");

  function handleChangePosition(position: number | null) {
    setSelectedPosition(position);
  }

  function handleChangeSnippet(snippet: number | null) {
    setSelectedSnippet(snippet);
  }

  if (!post)
    return (
      <div>
        <p>Select Post to Continue</p>
      </div>
    );

  return (
    <div className="  w-full max-w-[1100px] mx-auto py-2 px-3">
      <div className="flex gap-6 divide-x divide-dashed divide-[#1f1d1a4d]">
        <div className="flex flex-col w-[400px] gap-2 justify-between">
          {/* <div className="border border-tertiary border-dashed rounded bg-black bg-opacity-10 p-2">
            <div style={{ zoom: 0.6 }}>
              <BlogWithAuthor />
            </div>
          </div>
          <div className="border border-tertiary border-dashed rounded bg-black bg-opacity-10 p-2">
            <div style={{ zoom: 0.6 }}>
              <BlogWithAuthorV2 />
            </div>
          </div>
          <div className="border border-tertiary border-dashed rounded bg-black bg-opacity-10 p-2">
            <div style={{ zoom: 0.9 }}>
              <BlueCircleBlog />
            </div>
          </div> */}
          <div>
            <div className="py-3 group">
              <div className="flex">
                <div className="mr-2">
                  <img
                    className="w-[38px] h-[38px]"
                    src={post.author.photoURL ?? avatar.src}
                    alt="avatar"
                  />
                </div>
                <div>
                  <h3 className="leading-[120%] text-[17px] group-hover:text-appBlue">
                    {post.author.name}
                  </h3>
                  {/* <input
                    type="text"
                    value="Kadia Goba"
                    className="leading-[120%] bg-transparent text-[17px] group-hover:text-appBlue"
                  /> */}
                  <p
                    className="leading-[120%] text-[15px] text-tertiary group-hover:text-appBlue font-helvetica uppercase"
                    style={{
                      fontWeight: "300",
                      fontVariationSettings: '"wght" 400,"opsz" 10',
                    }}
                  >
                    {post.topic}
                  </p>
                </div>
              </div>
              <hr className="border-dashed border-[#1f1d1a4d] my-4" />
              <div>
                {/* <h2
                  className="font-featureHeadline leading-[120%] group-hover:text-appBlue bg-animation group-hover:bg-hover-animation"
                  style={{
                    fontSize: "32px",
                    fontWeight: "395",
                    fontVariationSettings: '"wght" 495,"opsz" 10',
                  }}
                >
                  {post.snippetData?.title}
                </h2> */}
                <textarea
                  name=""
                  id=""
                  rows={3}
                  className="font-featureHeadline leading-[120%] w-full bg-transparent"
                  style={{
                    fontSize: "32px",
                    fontWeight: "395",
                    fontVariationSettings: '"wght" 495,"opsz" 10',
                    background: "#ede9c3",
                    padding: "5px 7px",
                  }}
                >
                  {post.snippetData?.title}
                </textarea>
                {/* <p
                  className="leading-[120%] w-full bg-transparent"
                  style={{
                    fontSize: "18px",
                    paddingTop: "10px",
                  }}
                >
                  {post.snippetData?.content}
                </p> */}
                <textarea
                  name=""
                  id=""
                  rows={3}
                  className="leading-[120%] w-full bg-transparent"
                  style={{
                    fontSize: "18px",
                    paddingTop: "10px",
                    background: "#ede9c3",
                    padding: "5px 7px",
                  }}
                >
                  {post.snippetData?.content}
                </textarea>
                {post.snippetData?.image && (
                  <figure className="mt-2">
                    <img src={post.snippetData?.image} alt="Image One" />
                  </figure>
                )}
                {!post.snippetData?.image && post.snippetData?.iframe && (
                  <iframe
                    width="100%"
                    src={post.snippetData?.iframe}
                    className="mt-2 aspect-video"
                  ></iframe>
                )}
                {/* <p
                  className="leading-[120%] text-[12px] mt-1.5 text-tertiary"
                  style={{
                    fontFamily: "Courier,monospace",
                  }}
                >
                  REUTERS/Leah Millis
                </p> */}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 pl-5">
          <div>
            <div
              className="mb-4 border-b border-tertiary p-2 flex items-center justify-between cursor-pointer"
              onClick={() =>
                setOpenDropdown((c) => (c === "design" ? null : "design"))
              }
            >
              <h2>Select Snippet Design</h2>
              <TbCaretDownFilled />
            </div>
            <div
              className={
                "overflow-hidden h-auto " +
                (openDropdown === "design" ? " max-h-full p-3" : " max-h-0")
              }
            >
              <div className="flex gap-4 justify-between">
                <div className="flex flex-col gap-4">
                  <div style={{ zoom: 0.6 }}>
                    <SnippetPositionControl
                      handleChange={handleChangeSnippet}
                      value={1}
                      isSelected={selectedSnippet === 1}
                    >
                      <div className="pointer-events-none">
                        <BlogWithAuthor post={post} noLink />
                      </div>
                    </SnippetPositionControl>
                  </div>

                  <div style={{ zoom: 0.6 }}>
                    <SnippetPositionControl
                      handleChange={handleChangeSnippet}
                      value={2}
                      isSelected={selectedSnippet === 2}
                    >
                      <div className="pointer-events-none">
                        <BlogWithAuthorV2 post={post} noLink noImage />
                      </div>
                    </SnippetPositionControl>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div style={{ zoom: 0.6 }}>
                    <SnippetPositionControl
                      handleChange={handleChangeSnippet}
                      value={3}
                      isSelected={selectedSnippet === 3}
                    >
                      <div className="pointer-events-none">
                        <BlogWithAuthorV2 post={post} noLink />
                      </div>
                    </SnippetPositionControl>
                  </div>

                  <div style={{ zoom: 0.9 }}>
                    <SnippetPositionControl
                      handleChange={handleChangeSnippet}
                      value={4}
                      iconStyle={{ zoom: 0.6 }}
                      isSelected={selectedSnippet === 4}
                    >
                      <div className="pointer-events-none">
                        <BlueCircleBlog post={post} noLink />
                      </div>
                    </SnippetPositionControl>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <div
              className="mb-4 border-b border-tertiary p-2 flex items-center justify-between cursor-pointer"
              onClick={() =>
                setOpenDropdown((c) => (c === "position" ? null : "position"))
              }
            >
              <h2>Select Snippet Position</h2>
              <TbCaretDownFilled />
            </div>
            <div
              className={
                "overflow-hidden h-auto " +
                (openDropdown === "position" ? " max-h-full p-3" : " max-h-0")
              }
            >
              <div style={{ zoom: 0.5 }}>
                <div className="grid grid-cols-1 md:grid-cols-[21%_54%_25%] py-2">
                  <div className="pr-0 md:pr-7">
                    <div className="pt-5 flex md:flex-col flex-row divide-x md:divide-x-0 md:divide-y divide-dashed divide-[#1f1d1a4d] overflow-x-auto md:overflow-visible">
                      <SnippetPositionControl
                        handleChange={handleChangePosition}
                        value={4}
                        isSelected={selectedPosition === 4}
                      >
                        {Array.from({ length: 9 }).map((_, i) => (
                          <div
                            key={i}
                            className="pointer-events-none md:px-0 mx-1 min-w-[170px]"
                          >
                            <BlueCircleBlog post={post} noLink />
                          </div>
                        ))}
                      </SnippetPositionControl>
                    </div>
                  </div>
                  <div className="md:border-x border-dashed border-[#1f1d1a4d] px-4">
                    <SnippetPositionControl
                      handleChange={handleChangePosition}
                      value={1}
                      isSelected={selectedPosition === 1}
                    >
                      <div className="pointer-events-none">
                        <BlogWithAuthor post={post} noLink />
                      </div>
                    </SnippetPositionControl>
                    <SnippetPositionControl
                      handleChange={handleChangePosition}
                      value={3}
                      isSelected={selectedPosition === 3}
                    >
                      <div
                        className="grid divide-y divide-dashed divide-[#1f1d1a4d]"
                        // style={{ filter: "blur(4px)" }}
                      >
                        {[
                          [1, 2],
                          [3, 4],
                        ]?.map((postChunkOf2, i) => (
                          <div
                            key={postChunkOf2[0]}
                            className="grid grid-cols-2 divide-x divide-dashed divide-[#1f1d1a4d] py-3"
                          >
                            {postChunkOf2.map((_post, j) => (
                              <div
                                key={_post}
                                className={
                                  "pointer-events-none " +
                                  (j % 2 === 0 ? "pr-3" : "pl-3")
                                }
                              >
                                <BlogWithAuthorV2
                                  noLink
                                  post={post}
                                  size="sm"
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </SnippetPositionControl>
                  </div>
                  <div className="px-5 md:pl-7 md:pr-0">
                    <SnippetPositionControl
                      handleChange={handleChangePosition}
                      value={2}
                      isSelected={selectedPosition === 2}
                    >
                      <div className="pointer-events-none">
                        <BlogWithAuthor post={post} noLink size="sm" />
                      </div>
                    </SnippetPositionControl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}