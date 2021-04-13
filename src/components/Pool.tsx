import React, { useContext, useEffect, useState } from "react";
import Card from "react-bootstrap/esm/Card";
import Button from "react-bootstrap/esm/Button";
import Row from "react-bootstrap/esm/Row";
import Table from "react-bootstrap/esm/Table";
import ethers from "ethers";
import NumberFormat from "react-number-format";

import SignerContext from "../state/SignerContext";
import TokensContext from "../state/TokensContext";
import OraclesContext from "../state/OraclesContext";
import GovernanceContext from "../state/GovernanceContext";
import { toUSD } from "../utils/utils";
import "../styles/farm.scss";
import { ReactComponent as CtxIcon } from "../assets/images/ctx-coin.svg";
import { ReactComponent as TcapIcon } from "../assets/images/tcap-coin.svg";
import { ReactComponent as WETHIcon } from "../assets/images/graph/weth.svg";
// import { ReactComponent as WBTCIcon } from "../assets/images/graph/WBTC.svg";
import { ReactComponent as DAIIcon } from "../assets/images/graph/DAI.svg";
import Loading from "./Loading";

const Farm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [ethLiquidity, setEthLiquidity] = useState("0");
  const [ethLiquidityUNI, setEthLiquidityUNI] = useState("0");
  const [daiLiquidity, setDaiLiquidity] = useState("0");
  // const [ctxLiquidty, setCtxLiquidty] = useState("0.0");

  const signer = useContext(SignerContext);
  const tokens = useContext(TokensContext);
  const oracles = useContext(OraclesContext);
  const governance = useContext(GovernanceContext);

  const lpURL = process.env.REACT_APP_LP_URL;
  const lpUniURL = process.env.REACT_APP_LP_URL_UNI;
  const visionURL = process.env.REACT_APP_LP_VISION;
  const uniVisionURL = process.env.REACT_APP_LP_UNI_VISION;

  const phase = process.env.REACT_APP_PHASE ? parseInt(process.env.REACT_APP_PHASE) : 0;

  useEffect(() => {
    const loadAddress = async () => {
      if (
        signer.signer &&
        tokens.tcapToken &&
        oracles.tcapOracle &&
        governance.ctxToken &&
        governance.governorAlpha &&
        governance.timelock
      ) {
        const ethUSD = ethers.utils.formatEther(
          (await oracles.wethOracle?.getLatestAnswer()).mul(10000000000)
        );
        const daiUSD = ethers.utils.formatEther(
          (await oracles.daiOracle?.getLatestAnswer()).mul(10000000000)
        );

        const tcapUSD = ethers.utils.formatEther(await oracles.tcapOracle?.getLatestAnswer());

        const currentPoolWeth = await tokens.wethToken?.balanceOf(process?.env?.REACT_APP_POOL_ETH);
        let formatPair1 = ethers.utils.formatEther(currentPoolWeth);
        const currentWethTCAP = await tokens.tcapToken?.balanceOf(process?.env?.REACT_APP_POOL_ETH);
        let formatPair2 = ethers.utils.formatEther(currentWethTCAP);
        let totalUSD = toUSD(formatPair1, ethUSD) + toUSD(formatPair2, tcapUSD);
        setEthLiquidity(totalUSD.toString());

        const currentPoolWethUNI = await tokens.wethToken?.balanceOf(
          process?.env?.REACT_APP_POOL_ETH_UNI
        );
        console.log(process?.env?.REACT_APP_POOL_ETH_UNI);
        console.log(
          "🚀 ~ file: Pool.tsx ~ line 70 ~ loadAddress ~ currentPoolWethUNI",
          currentPoolWethUNI
        );

        formatPair1 = ethers.utils.formatEther(currentPoolWethUNI);
        const currentWethTCAPUNI = await tokens.tcapToken?.balanceOf(
          process?.env?.REACT_APP_POOL_ETH_UNI
        );
        formatPair2 = ethers.utils.formatEther(currentWethTCAPUNI);
        console.log(
          "🚀 ~ file: Pool.tsx ~ line 76 ~ loadAddress ~ currentWethTCAPUNI",
          currentWethTCAPUNI
        );
        totalUSD = toUSD(formatPair1, ethUSD) + toUSD(formatPair2, tcapUSD);
        console.log("🚀 ~ file: Pool.tsx ~ line 76 ~ loadAddress ~ totalUSD", totalUSD);
        setEthLiquidityUNI(totalUSD.toString());

        if (phase > 2) {
          const currentPoolWbtc = await tokens.wbtcToken?.balanceOf(
            process?.env?.REACT_APP_POOL_WBTC
          );
          formatPair1 = ethers.utils.formatEther(currentPoolWbtc);

          const currentPoolDai = await tokens.daiToken?.balanceOf(process?.env?.REACT_APP_POOL_DAI);
          formatPair1 = ethers.utils.formatEther(currentPoolDai);
          const currentDaiTCAP = await tokens.tcapToken?.balanceOf(
            process?.env?.REACT_APP_POOL_DAI
          );
          formatPair2 = ethers.utils.formatEther(currentDaiTCAP);
          totalUSD = toUSD(formatPair1, daiUSD) + toUSD(formatPair2, tcapUSD);
          setDaiLiquidity(totalUSD.toString());
        }

        // const currentPoolCtx = await governance.ctxToken?.balanceOf(
        //   process?.env?.REACT_APP_POOL_CTX
        // );
        // const currentPoolWethCtx = await tokens.wethToken?.balanceOf(
        //   process?.env?.REACT_APP_POOL_CTX
        // );
      }
      setIsLoading(false);
    };

    loadAddress();
    // eslint-disable-next-line
  }, []);

  if (isLoading) {
    return <Loading title="Loading" message="Please wait" />;
  }

  return (
    <div className="farm">
      <div>
        <h3>Pools </h3>{" "}
        <Row className="card-wrapper">
          <>
            <Card className="diamond pool mt-4">
              <h2>Enabled Pools </h2>
              <Table hover className="mt-2">
                <thead>
                  <tr>
                    <th />
                    <th>Available Pools</th>
                    <th>Liquidity</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <WETHIcon className="weth" />
                      <TcapIcon className="tcap" />
                    </td>
                    <td>
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={`${visionURL}/${process?.env?.REACT_APP_POOL_ETH}`}
                      >
                        ETH/TCAP <br />
                        <small>SushiSwap</small>
                      </a>
                    </td>
                    <td className="number">
                      $
                      <NumberFormat
                        className="number"
                        value={ethLiquidity}
                        displayType="text"
                        thousandSeparator
                        prefix=""
                        decimalScale={2}
                      />{" "}
                    </td>
                    <td className="number">
                      <Button
                        variant="primary"
                        className=""
                        target="_blank"
                        href={`${lpURL}/#/add/${tokens.tcapToken?.address}/ETH`}
                      >
                        Pool
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <WETHIcon className="weth" />
                      <TcapIcon className="tcap" />
                    </td>
                    <td>
                      <a
                        className="uniswap"
                        target="_blank"
                        rel="noreferrer"
                        href={`${uniVisionURL}/${process?.env?.REACT_APP_POOL_ETH_UNI}`}
                      >
                        ETH/TCAP <br />
                        <small>UniSwap V2</small>
                      </a>
                    </td>
                    <td className="number">
                      $
                      <NumberFormat
                        className="number"
                        value={ethLiquidityUNI}
                        displayType="text"
                        thousandSeparator
                        prefix=""
                        decimalScale={2}
                      />{" "}
                    </td>
                    <td className="number">
                      <Button
                        variant="primary"
                        className=""
                        target="_blank"
                        href={`${lpUniURL}/#/add/${tokens.tcapToken?.address}/ETH`}
                      >
                        Pool
                      </Button>
                    </td>
                  </tr>
                  {phase > 2 && (
                    <>
                      <tr>
                        <td>
                          <DAIIcon className="dai" />
                          <TcapIcon className="tcap" />{" "}
                        </td>
                        <td>
                          {" "}
                          <a
                            target="_blank"
                            rel="noreferrer"
                            href={`${visionURL}/${process?.env?.REACT_APP_POOL_DAI}`}
                          >
                            DAI/TCAP <br />
                            <small>SushiSwap</small>
                          </a>
                        </td>
                        <td className="number">
                          $
                          <NumberFormat
                            className="number"
                            value={daiLiquidity}
                            displayType="text"
                            thousandSeparator
                            prefix=""
                            decimalScale={2}
                          />{" "}
                        </td>{" "}
                        <td className="number">
                          <Button
                            variant="primary"
                            className=""
                            target="_blank"
                            href={`${lpURL}/#/add/${tokens.tcapToken?.address}/${tokens.daiToken?.address}`}
                          >
                            Pool
                          </Button>
                        </td>
                      </tr>
                      {phase > 3 && (
                        <tr>
                          <td>
                            <CtxIcon className="ctx-neon" />
                            <WETHIcon className="weth" />{" "}
                          </td>
                          <td>
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={`${visionURL}/${process?.env?.REACT_APP_POOL_CTX}`}
                            >
                              CTX/ETH Pool <br />
                              <small>SushiSwap</small>
                            </a>
                          </td>
                          <td className="number">
                            N/A
                            {/* <NumberFormat
                          className="number"
                          value={1}
                          displayType="text"
                          thousandSeparator
                          prefix=""
                          decimalScale={2}
                        />{" "} */}
                          </td>{" "}
                          <td className="number">
                            <Button
                              variant="primary"
                              className=""
                              target="_blank"
                              href={`${lpURL}/#/add/ETH/${governance.ctxToken?.address}`}
                            >
                              Pool
                            </Button>
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </Table>
            </Card>
          </>
        </Row>
      </div>
    </div>
  );
};
export default Farm;
