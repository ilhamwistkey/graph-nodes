"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import EChartsGraph from "./component/EChartsGraph";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [data, setData] = useState(null);

  const scrollingText = ["Calculating the most effective learning trajectory with AI to enhance your math proficiency.", "Tailoring your math learning journey with precision to improve your accuracy and understanding.", "Our machine learning algorithms are fine-tuning exercises tailored to your progression."];

  const fetchData = () => {
    setData(null)
    setIsLoading(true);
    setIsLoadingBtn(true);
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(data_ => {
        console.log(data);
        setTimeout(() => {
          setData(data_);
          setIsLoading(false);
        }, 3000);
        setTimeout(() => {
          setIsLoadingBtn(false);
        }, 15000);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
        setIsLoadingBtn(false);
      });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.btnWrapper}>
        <div className={styles.btnLoad} onClick={fetchData}>
          {isLoadingBtn ? <div className={styles.spinner}></div> : 'Load Graph'}
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.graphWrapper}>
          {!data ? <></> : isLoading ? <div className={styles.spinnerGraph}></div> : <EChartsGraph />}
        </div>
        <div className={styles.box}>
          <ul className={styles.list}>
            {scrollingText.map((text, index) => (
              <li key={index} className={styles.item}>{text}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
  
}
