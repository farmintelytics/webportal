import hashlib
import time

def generate_report_hash(metadata: dict) -> str:
    """
    Generates a cryptographic SHA-256 hash of report data.
    Formula: SHA256(metadata_str + timestamp)
    """
    serialized = f"{sorted(metadata.items())}_{time.time()}"
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()

def register_hash_on_chain(report_hash: str, plot_id: str) -> dict:
    """
    Simulates submitting the SHA-256 report hash to an EVM-compatible carbon credit ledger (e.g. Polygon / Hedera).
    """
    tx_hash = f"0x{hashlib.sha256(f'{report_hash}_{time.time()}'.encode('utf-8')).hexdigest()}"
    return {
        "status": "Success",
        "blockchain": "Polygon (EVM)",
        "smart_contract": "0xcAb26388C83818e9508C61D4C6975a5078a9c803",
        "transaction_hash": tx_hash,
        "block_number": 48293021,
        "registered_at": time.strftime("%Y-%m-%d %H:%M:%S GMT")
    }
