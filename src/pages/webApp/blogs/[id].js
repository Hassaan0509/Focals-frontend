import axios from "axios";
import styles from "../../../styles";

export default function SingleBlog({ blogData }) {
  return (
      <div className={`${styles.paddings} text-white`}>
        <div className="md:flex md:flex-row md:justify-between md:items-center md:gap-5">
          <div className="md:text-[64px] text-[50px] font-extrabold ">
            {blogData.title}
          </div>
          <div>
            <div className="text-gray-400">by:</div>
            <div className="text-[20px] font-bold">{blogData.author}</div>
          </div>
        </div>
        <div className="mb-[30px] h-[2px]  bg-white opacity-20" />
          
        <div className="flex justify-end mb-[10px] font-bold text-[15px] md:text-[24px]">
        {blogData.date}
        </div>
        <div className="text-justify glassmorphism p-5 rounded-2xl">
          <p className="leading-8 text-[20px] text-gray-100 tracking-wide">
            {blogData.content}
          </p>
        </div>
      </div>

  );
}

export async function getStaticPaths() {
  const response = await axios.get("https://enigmatic-badlands-35417.herokuapp.com/blogs/getAllBlogIds");
  const blogids = response.data;
  return {
    fallback: "blocking",
    paths: blogids.map((blogid) => ({
      params: { id: blogid._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  const id = context.params.id;
  const res = await axios.get(`https://enigmatic-badlands-35417.herokuapp.com/blogs/getBlogById/${id}`);
  const blogData = res.data;
  return {
    props: {
      blogData,
    },
  };
}