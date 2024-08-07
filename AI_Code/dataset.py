import os
import shutil
import random
from pathlib import Path


def generate_label_file():
    pass


def split_dataset(src_dir, dest_dir, train_ratio=0.7, validation_ratio=0.2):
    src_dir = Path(src_dir) if isinstance(src_dir, str) else src_dir
    dest_dir = Path(dest_dir) if isinstance(dest_dir, str) else dest_dir

    test_ratio = 1 - (train_ratio + validation_ratio)
    if not (0 <= train_ratio <= 1 and 0 <= validation_ratio <= 1 and test_ratio >= 0):
        print("Invalid ratio")
        return

    # Create destination directories
    for segment in ["train", "validation", "test"]:
        segment_dir = dest_dir / segment
        if segment_dir.exists():
            shutil.rmtree(segment_dir)
        segment_dir.mkdir(parents=True, exist_ok=True)

    class_names = [
        "drugs",
        "explicit",
        "gambling",
        "games",
        "monetary",
        "profanity",
        "social",
    ]
    class_to_id = {class_name: idx for idx, class_name in enumerate(class_names)}

    # Iterate over each class folder
    for class_folder in src_dir.iterdir():
        if class_folder.is_dir():
            all_files = [f for f in class_folder.iterdir() if f.suffix == ".jpg"]
            random.shuffle(all_files)

            train_split = int(len(all_files) * train_ratio)
            validation_split = int(len(all_files) * validation_ratio)
            test_split = len(all_files) - train_split - validation_split
            print(f"{class_folder}: ({train_split}, {validation_split}, {test_split})")

            train_files = all_files[:train_split]
            validation_files = all_files[train_split : train_split + validation_split]
            test_files = all_files[train_split + validation_split :]

            for files, split in [
                (train_files, "train"),
                (validation_files, "validation"),
                (test_files, "test"),
            ]:
                output_dir = dest_dir / split / class_folder.name
                output_dir.mkdir(parents=True, exist_ok=True)

                for file in files:
                    source_path = file
                    destination_path = output_dir / file.name
                    print(f"{source_path} -> {destination_path}")
                    shutil.copy(source_path, destination_path)


if __name__ == "__main__":
    split_dataset("images", "training_data")
