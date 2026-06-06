import os
import json
import struct

def generate_zarr():
    zarr_dir = os.path.join(os.path.dirname(__file__), 'api', 'data', 'remote_sensing.zar')
    os.makedirs(zarr_dir, exist_ok=True)
    
    # 1. Create .zgroup
    with open(os.path.join(zarr_dir, '.zgroup'), 'w') as f:
        json.dump({"zarr_format": 2}, f, indent=2)
        
    # 2. Create .zattrs
    with open(os.path.join(zarr_dir, '.zattrs'), 'w') as f:
        json.dump({
            "description": "Geospatial Remote Sensing Timeseries for Farmintelytics",
            "variables": ["ndvi", "ndmi"],
            "dimensions": ["time"]
        }, f, indent=2)
        
    # 3. Create ndvi array
    ndvi_dir = os.path.join(zarr_dir, 'ndvi')
    os.makedirs(ndvi_dir, exist_ok=True)
    with open(os.path.join(ndvi_dir, '.zarray'), 'w') as f:
        json.dump({
            "chunks": [24],
            "compressor": None,
            "dtype": "<f4",
            "fill_value": 0.0,
            "filters": None,
            "order": "C",
            "shape": [24],
            "zarr_format": 2
        }, f, indent=2)
    with open(os.path.join(ndvi_dir, '.zattrs'), 'w') as f:
        json.dump({
            "name": "Normalized Difference Vegetation Index",
            "units": "1"
        }, f, indent=2)
        
    # NDVI values (24 weeks)
    ndvi_values = [
        0.63, 0.68, 0.65, 0.69, 0.66, 0.70, 0.67, 0.71, 
        0.68, 0.72, 0.69, 0.73, 0.70, 0.74, 0.71, 0.75, 
        0.72, 0.76, 0.73, 0.77, 0.74, 0.78, 0.75, 0.79
    ]
    with open(os.path.join(ndvi_dir, '0'), 'wb') as f:
        f.write(struct.pack(f"<{len(ndvi_values)}f", *ndvi_values))
        
    # 4. Create ndmi array
    ndmi_dir = os.path.join(zarr_dir, 'ndmi')
    os.makedirs(ndmi_dir, exist_ok=True)
    with open(os.path.join(ndmi_dir, '.zarray'), 'w') as f:
        json.dump({
            "chunks": [24],
            "compressor": None,
            "dtype": "<f4",
            "fill_value": 0.0,
            "filters": None,
            "order": "C",
            "shape": [24],
            "zarr_format": 2
        }, f, indent=2)
    with open(os.path.join(ndmi_dir, '.zattrs'), 'w') as f:
        json.dump({
            "name": "Normalized Difference Moisture Index",
            "units": "1"
        }, f, indent=2)
        
    # NDMI values (24 weeks)
    ndmi_values = [
        0.38, 0.42, 0.40, 0.43, 0.41, 0.44, 0.42, 0.45,
        0.43, 0.46, 0.44, 0.47, 0.45, 0.48, 0.46, 0.49,
        0.47, 0.50, 0.48, 0.51, 0.49, 0.52, 0.50, 0.53
    ]
    with open(os.path.join(ndmi_dir, '0'), 'wb') as f:
        f.write(struct.pack(f"<{len(ndmi_values)}f", *ndmi_values))
        
    print("Successfully generated Geospatial Zarr dataset at:", zarr_dir)

if __name__ == '__main__':
    generate_zarr()
