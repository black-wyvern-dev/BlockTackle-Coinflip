export default function Faq() {
  const data = [
    {
      title: 'WHAT TOKENS CAN I FLIP?',
      text: 'You can kickflip GRIND or select a token from our list. '
    },
    {
      title: 'WHAT ARE THE FEES?',
      text: 'We charge 3% per kickflip irrespective of winning or losing. For example, kickflipping 1 SOL will cost a total of 1.03 SOL.'
    },
    {
      title: 'HOW DO I COLLECT MY WINNINGS?',
      text: 'We charge 3% per kickflip irrespective of winning or losing. For example, kickflipping 1 SOL will cost a total of 1.03 SOL.'
    },
    {
      title: 'WHAT’S THE MAX AMOUNT I CAN BET?',
      text: 'Every token has it’s own max limit based on our treasury size. You can bet any amount up to the max limit!'
    },
    {
      title: 'WHY IS THE BALANCE SHOWN SLIGHTLY LESS THAN MY ACTUAL WALLET BALANCE?',
      text: 'We have calculated your balance to compensate for 3% fees.'
    },
    {
      title: 'WHAT ARE THE ON-CHAIN ADDRESSES?',
      text: 'Program : 7ttfENVhNwb21KjZiLHgXLsX2sC1rKoJgnTVL4wb54t1'
    }
  ];
  return (
    <div className="miscstats_section">
      <div className="table_box">
        {data.map((item, index) => (
          <div key={index} style={{ padding: '10px 0px' }}>
            <h3 className="faq_question"> {item.title} </h3>
            <h5 className="faq_answer"> {item.text} </h5>
          </div>
        ))}
      </div>
    </div>
  );
}
