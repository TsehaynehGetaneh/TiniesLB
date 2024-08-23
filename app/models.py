from django.db import models
from django.utils.text import slugify
from colorfield.fields import ColorField
import webcolors


def get_default_brand():
    brand = Brand.objects.first() or Brand.objects.create(name='Default Brand')
    return brand.id

def get_default_subcategory():
    category = Category.objects.first() or Category.objects.create(name='Default Category')
    subcategory = SubCategory.objects.first() or SubCategory.objects.create(name='Default SubCategory', category=category)
    return subcategory.id

class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    logo = models.ImageField(upload_to='brand_logos/', blank=True, null=True)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    background_image = models.ImageField(upload_to='category_images/', blank=True, null=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class SubCategory(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, related_name='subcategories', on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255, default='Default Product Name')  # Set a default value
    slug = models.SlugField(unique=True, max_length=255, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    image1 = models.ImageField(upload_to='product_images/', blank=True, null=True)
    image2 = models.ImageField(upload_to='product_images/', blank=True, null=True)
    image3 = models.ImageField(upload_to='product_images/', blank=True, null=True)
    image4 = models.ImageField(upload_to='product_images/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    brand = models.ForeignKey(Brand, related_name='products', on_delete=models.CASCADE, default=get_default_brand)
    subcategory = models.ForeignKey(SubCategory, related_name='products', on_delete=models.CASCADE, default=get_default_subcategory) 
    categories = models.ManyToManyField(Category, related_name='products', blank=True)
    in_stock = models.BooleanField(default=True)
    colors = models.ManyToManyField('Color', blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Color(models.Model):
    color = ColorField()

    def get_color_name(self):
        try:
            return webcolors.hex_to_name(self.color)
        except ValueError:
            return f"Unnamed Color - ({self.color})"

    def __str__(self):
        return self.get_color_name()

class Cart(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, null=True, blank=True)
    session_id = models.CharField(max_length=40, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.product.name} - {self.quantity}"