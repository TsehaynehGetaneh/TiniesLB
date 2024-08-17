from django.views.generic import TemplateView, DetailView
from django.shortcuts import get_object_or_404
from .models import Product, Category
from django.views.decorators.csrf import csrf_exempt
import requests
import json
from django.http import JsonResponse
from django.shortcuts import render
from django.db.models import Q
from django.core.paginator import Paginator
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator


class HomePage(TemplateView):
    template_name = 'pages/home.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # Get the four most recently added products
        recent_products = Product.objects.order_by('-id')[:4]
        context['recent_products'] = recent_products

        all_categories = Category.objects.order_by('-id')[:4]
        context['all_categories'] = all_categories

        return context


@method_decorator(cache_page(60 * 15), name='dispatch')
class AllProducts(TemplateView):
    template_name = 'pages/all_products.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        products = Product.objects.all()

        # Filter products
        brand_filter = self.request.GET.get('brand')
        age_filter = self.request.GET.get('age')
        search_query = self.request.GET.get('q')

        if brand_filter:
            products = products.filter(product_brand=brand_filter)
        if age_filter:
            products = products.filter(age_category=age_filter)
        if search_query:
            products = products.filter(
                Q(header__icontains=search_query) | Q(product_brand__icontains=search_query)
            )

            # Sorting functionality
        sort_by = self.request.GET.get('sort_by')

        if sort_by == 'price_asc':
            products = products.order_by('price')
        elif sort_by == 'price_desc':
            products = products.order_by('-price')
        elif sort_by == 'date_added':
            products = products.order_by('-id')

        # Pagination
        paginator = Paginator(products, 16) 
        page_number = self.request.GET.get('page')
        page_obj = paginator.get_page(page_number)

        context['products'] = products
        context['unique_brands'] = Product.objects.values_list('product_brand', flat=True).distinct()
        context['unique_age_categories'] = Product.objects.values_list('age_category', flat=True).distinct()
        context['search_query'] = search_query
        context['current_brand_filter'] = brand_filter 
        context['current_age_filter'] = age_filter
        context['page_obj'] = page_obj

        return context


class ProductDetail(DetailView):
    model = Product
    template_name = 'pages/product_detail.html'
    context_object_name = 'product'
    slug_url_kwarg = 'slug'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['products'] = Product.objects.all()

        # Get the four most recently added products
        recent_products = Product.objects.order_by('-id')[:4]
        context['recent_products'] = recent_products

        return context

class AllCategory(TemplateView):
    template_name = 'pages/all_category.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        all_categories = Category.objects.all()

        context['all_categories'] = all_categories
        return context

class ProductsByCategory(TemplateView):
    template_name = 'pages/products_by_category.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        category_slug = kwargs.get('category_slug')
        category = get_object_or_404(Category, slug=category_slug)
        products = Product.objects.filter(category=category)

        # Filter products
        brand_filter = self.request.GET.get('brand')
        age_filter = self.request.GET.get('age')
        search_query = self.request.GET.get('q')

        if brand_filter:
            products = products.filter(product_brand=brand_filter)
        if age_filter:
            products = products.filter(age_category=age_filter)
        if search_query:
            products = products.filter(
                Q(header__icontains=search_query) | Q(product_brand__icontains=search_query)
            )

        # Sorting functionality
        sort_by = self.request.GET.get('sort_by')

        if sort_by == 'price_asc':
            products = products.order_by('price')
        elif sort_by == 'price_desc':
            products = products.order_by('-price')
        elif sort_by == 'date_added':
            products = products.order_by('-id')

        # Pagination
        paginator = Paginator(products, 10)  # Show 10 products per page.
        page_number = self.request.GET.get('page')
        page_obj = paginator.get_page(page_number)

        context['unique_brands'] = Product.objects.values_list('product_brand', flat=True).distinct()
        context['unique_age_categories'] = Product.objects.values_list('age_category', flat=True).distinct()
        context['search_query'] = search_query
        context['current_brand_filter'] = brand_filter  
        context['current_age_filter'] = age_filter

        context['category'] = category
        context['page_obj'] = page_obj
        return context


def checkout_view(request):
    return render(request, 'pages/checkout.html')

@csrf_exempt
def send_to_telegram_view(request):
    if request.method == 'POST':
        try:
            received_data = json.loads(request.body)
            contact_details = received_data.get('contact', {})
            cart_items = received_data.get('cart', [])

            print(cart_items)

            # Prepare the message for Telegram
            message = f"New Order Details:\n\nContact Information:\nName: {contact_details.get('name')}\nSurname: {contact_details.get('surname')}\nNumber: {contact_details.get('number')}\nAddress: {contact_details.get('address')}\n\nOrdered Items:\n"

            # Include details about the selected products
            for item in cart_items:
                product_name = item.get('name', '')
                product_price = item.get('price', 0.0)
                product_quantity = item.get('quantity', 0)

                message += f"Product: {product_name}\nPrice: ${product_price}\nQuantity: {product_quantity}\n\n"

            # Send message to Telegram
            send_to_telegram(message)

            return JsonResponse({'status': 'success'})
        except Exception as e:
            print(f'Error processing the order: {str(e)}')  # Debug print
            return JsonResponse({'status': 'error', 'message': str(e)})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})



def send_to_telegram(message):
    bot_token = '7175554526:AAHnZJxRFuXtE8AEBPBc9pGDU5I3gHxuJIk'
    chat_id = '-1001915097883'

    telegram_api_url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
    params = {
        'chat_id': chat_id,
        'text': message,
    }

    response = requests.post(telegram_api_url, params=params)

    if response.status_code != 200:
        print(f"Failed to send message to Telegram. Status code: {response.status_code}")