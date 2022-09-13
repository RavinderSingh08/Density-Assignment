// @ts-nocheck
import React from "react";
import "./App.css";
import {
  Button,
  Container,
  LinearProgress,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { CoinList } from "./config/api";

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const App = () => {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList("usd"));
    setLoading(false);
    setCoins(data);
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );
  };

  return (
    <>
      <Container style={{ textAlign: "center", padding: 30 }}>
        <Typography style={{}}>Wallet Balance</Typography>
        <Typography style={{ fontSize: "2rem" }}>35,000 USD</Typography>
      </Container>
      <Container style={{ textAlign: "center" }}>
        <TextField
          label="Search..."
          variant="outlined"
          style={{ marginBottom: 20, marginTop: 20, width: "100%" }}
          onChange={(e) => setSearch(e.target.value.toLocaleLowerCase())}
        />
        <TableContainer component={Paper}>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "gold" }} />
          ) : (
            <Table aria-label="simple table">
              <TableHead style={{ fontWeight: "600" }}>
                <TableRow>
                  {["Coin", "Asset Price", "Market Cap", "Buy", "Sell"].map(
                    (head) => (
                      <TableCell
                        style={{ color: "black", fontWeight: "700" }}
                        key={head}
                        align="center"
                      >
                        {head}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {handleSearch()
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map((row) => {
                    return (
                      <TableRow key={row.name}>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            display: "flex",
                            gap: 15,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={row?.image}
                            alt={row?.name}
                            height="50"
                            style={{ marginBottom: 10 }}
                          />
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span
                              style={{
                                textTransform: "uppercase",
                                fontSize: 22,
                              }}
                            >
                              {row.symbol}
                            </span>
                            <span style={{ color: "darkgrey" }}>
                              {row.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          USD {numberWithCommas(row.current_price.toFixed(2))}
                        </TableCell>

                        <TableCell align="center">
                          {row.symbol}{" "}
                          {numberWithCommas(
                            row.market_cap.toString().slice(0, -6)
                          )}
                          M
                        </TableCell>

                        <TableCell align="center">
                          <Stack spacing={2}>
                            <Button variant="contained" color="success">
                              Buy
                            </Button>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          <Stack spacing={2}>
                            <Button variant="contained" color="error">
                              Sell
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <Pagination
          style={{
            padding: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          // @ts-ignore
          count={(handleSearch()?.length / 10).toFixed(0)}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        />
      </Container>
    </>
  );
};

export default App;
