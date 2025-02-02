import pandas as pd
import requests
from datetime import datetime
import os

API_KEY = "b88ee10c-aa4f-4152-9968-5ed0d9c74060"
DATE_TODAY = datetime.now().strftime("%Y-%m-%d")  # Format : YYYY-MM-DD
OUTPUT_FILE_NAME = f"data/crypto_data_updated_{DATE_TODAY}.csv"
INPUT_FILE_NAME = "data/cryptos.csv"
YESTERDAY_FILE_NAME = f"data/crypto_data_updated_{(datetime.now() - pd.Timedelta(days=1)).strftime('%Y-%m-%d')}.csv"

def read_crypto_ids(input_file):
    cryptos_list = pd.read_csv(input_file, sep=';')
    return cryptos_list["cmc_id"].tolist()

def fetch_crypto_data(cmc_ids, api_key):
    url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest"
    headers = {
        "Accepts": "application/json",
        "X-CMC_PRO_API_KEY": api_key,
    }
    parameters = {
        "id": ",".join(map(str, cmc_ids))
    }
    response = requests.get(url, headers=headers, params=parameters)
    
    if response.status_code == 200:
        data = response.json()
        crypto_data = []

        for cmc_id in cmc_ids:
            try:
                crypto_info = data['data'][str(cmc_id)]
                crypto_data.append({
                    "cmc_id": cmc_id,
                    "name": crypto_info['name'],
                    "symbol": crypto_info['symbol'],
                    "price": crypto_info['quote']['USD']['price'],
                    "volume_24h": crypto_info['quote']['USD']['volume_24h'],
                    "market_cap": crypto_info['quote']['USD']['market_cap'],
                })
            except KeyError:
                print(f"Aucune donnée pour l'ID {cmc_id}")

        return crypto_data
    else:
        print(f"Erreur lors de la requête API : {response.status_code}")
        return None

def save_crypto_data(data, output_file):
    if data:
        df = pd.DataFrame(data)
        df.to_csv(output_file, index=False)

def read_crypto_data(file_name):
    if os.path.exists(file_name):
        return pd.read_csv(file_name)
    else:
        return None

def calculate_daily_performance(today_data, yesterday_data):
    if yesterday_data is None:
        return None
    
    today_df = pd.DataFrame(today_data)
    yesterday_df = pd.DataFrame(yesterday_data)
    
    merged_df = today_df.merge(yesterday_df, on='cmc_id', suffixes=('_today', '_yesterday'))
    merged_df['gain_value'] = merged_df['price_today'] - merged_df['price_yesterday']
    merged_df['gain_percentage'] = (merged_df['gain_value'] / merged_df['price_yesterday']) * 100
    merged_df['volume_change'] = merged_df['volume_24h_today'] - merged_df['volume_24h_yesterday']
    merged_df['market_cap_change'] = merged_df['market_cap_today'] - merged_df['market_cap_yesterday']
    merged_df['volume_change_percentage'] = (merged_df['volume_change'] / merged_df['volume_24h_yesterday']) * 100
    merged_df['market_cap_change_percentage'] = (merged_df['market_cap_change'] / merged_df['market_cap_yesterday']) * 100
    merged_df['daily_return'] = (merged_df['price_today'] / merged_df['price_yesterday']) - 1
    
    return merged_df[['cmc_id', 'name_today', 'symbol_today', 'price_today', 'price_yesterday', 'gain_value', 'gain_percentage', 'volume_24h_today', 'volume_24h_yesterday', 'volume_change', 'volume_change_percentage', 'market_cap_today', 'market_cap_yesterday', 'market_cap_change', 'market_cap_change_percentage', 'daily_return']]

def main():
    cmc_ids = read_crypto_ids(INPUT_FILE_NAME)
    crypto_data = fetch_crypto_data(cmc_ids, API_KEY)
    save_crypto_data(crypto_data, OUTPUT_FILE_NAME)
    
    yesterday_data = read_crypto_data(YESTERDAY_FILE_NAME)
    performance_data = calculate_daily_performance(crypto_data, yesterday_data)
    
    if performance_data is not None:
        performance_output_file = f"data/rendement/crypto_performance_data_{DATE_TODAY}.csv"
        performance_data.to_csv(performance_output_file, index=False)

if __name__ == "__main__":
    main()